const mongoose = require("mongoose");
const Product = require("../models/Product");
const Sale = require("../models/Sale");

// ==========================================
// CREATE PHYSICAL SHOP SALE
// ==========================================
const createSale = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { customerName, items, paymentMethod } = req.body;

        // Basic validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "At least one product is required."
            });
        }

        // Validate payment method
        const allowedPaymentMethods = ["cash", "upi", "credit"];

        if (
            paymentMethod &&
            !allowedPaymentMethods.includes(paymentMethod)
        ) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "Invalid payment method."
            });
        }

        const productIds = items.map((item) => item.product);

        // Get all products from database
        const products = await Product.find({
            _id: { $in: productIds }
        }).session(session);

        // Make a quick lookup map
        const productMap = new Map();

        products.forEach((product) => {
            productMap.set(product._id.toString(), product);
        });

        const saleItems = [];
        let totalAmount = 0;

        // ==========================================
        // CHECK STOCK + PREPARE SALE ITEMS
        // ==========================================
        for (const item of items) {
            if (!item.product) {
                throw new Error("Product ID is required.");
            }

            const quantity = Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                throw new Error(
                    "Product quantity must be a positive whole number."
                );
            }

            const product = productMap.get(
                item.product.toString()
            );

            if (!product) {
                throw new Error(
                    `Product not found: ${item.product}`
                );
            }

            // Check available stock
            if (product.stock < quantity) {
                throw new Error(
                    `Not enough stock for "${product.name}". Available stock: ${product.stock}`
                );
            }

            const price = Number(product.price);
            const itemTotal = price * quantity;

            saleItems.push({
                product: product._id,
                name: product.name,
                price,
                quantity,
                total: itemTotal
            });

            totalAmount += itemTotal;

            // ==========================================
            // REDUCE PRODUCT STOCK
            // ==========================================
            product.stock -= quantity;

            await product.save({ session });
        }

        // ==========================================
        // GENERATE BILL NUMBER
        // ==========================================
        const billNumber = `SF-${Date.now()}`;

        // ==========================================
        // CREATE SALE
        // ==========================================
        const sale = await Sale.create(
            [
                {
                    billNumber,
                    customerName:
                        customerName?.trim() ||
                        "Walk-in Customer",

                    items: saleItems,

                    totalAmount,

                    paymentMethod:
                        paymentMethod || "cash",

                    saleDate: new Date()
                }
            ],
            { session }
        );

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: "Sale created successfully.",
            sale: sale[0]
        });
    } catch (error) {
        await session.abortTransaction();

        console.error("Create sale error:", error);

        res.status(400).json({
            success: false,
            message: error.message || "Failed to create sale."
        });
    } finally {
        session.endSession();
    }
};


// ==========================================
// GET TODAY'S SALES
// ==========================================
const getTodaySales = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const sales = await Sale.find({
            saleDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ saleDate: -1 });

        const totalSales = sales.reduce(
            (sum, sale) => sum + sale.totalAmount,
            0
        );

        const totalBills = sales.length;

        const totalProductsSold = sales.reduce(
            (sum, sale) => {
                return (
                    sum +
                    sale.items.reduce(
                        (itemSum, item) =>
                            itemSum + item.quantity,
                        0
                    )
                );
            },
            0
        );

        res.json({
            success: true,
            sales,
            summary: {
                totalSales,
                totalBills,
                totalProductsSold
            }
        });
    } catch (error) {
        console.error("Get today's sales error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch today's sales."
        });
    }
};


// ==========================================
// GET ALL SALES HISTORY
// ==========================================
const getSales = async (req, res) => {
    try {
        console.log("GET /api/daily-sales called");

        const sales = await Sale.find({})
            .sort({ saleDate: -1 })
            .lean();

        console.log(
            "Sales history fetched:",
            sales.length
        );

        return res.status(200).json({
            success: true,
            sales
        });
    } catch (error) {
        console.error(
            "Get sales history error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch sales history."
        });
    }
};


// ==========================================
// GET SINGLE SALE / BILL
// ==========================================
const getSale = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: "Sale not found."
            });
        }

        res.json({
            success: true,
            sale
        });
    } catch (error) {
        console.error("Get sale error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch sale."
        });
    }
};


module.exports = {
    createSale,
    getTodaySales,
    getSales,
    getSale
};