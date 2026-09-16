const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Create order
const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const {
            items,
            customerName,
            phone,
            address,
            paymentMethod
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        if (!customerName || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: "Customer name, phone and address are required"
            });
        }

        let createdOrder;

        await session.withTransaction(async () => {
            const orderItems = [];
            let totalAmount = 0;

            for (const item of items) {
                const product = await Product.findById(item.productId)
                    .session(session);

                if (!product) {
                    throw new Error(
                        `Product not found: ${item.productId}`
                    );
                }

                const quantity = Number(item.quantity);

                if (!Number.isInteger(quantity) || quantity < 1) {
                    throw new Error(
                        `Invalid quantity for ${product.name}`
                    );
                }

                if (product.stock < quantity) {
                    throw new Error(
                        `Not enough stock for ${product.name}. Only ${product.stock} available.`
                    );
                }

                // Reduce stock
                product.stock -= quantity;
                await product.save({ session });

                const itemTotal = product.price * quantity;
                totalAmount += itemTotal;

                orderItems.push({
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.image || ""
                });
            }

            const orders = await Order.create(
                [
                    {
                        user: req.user.id,
                        items: orderItems,
                        totalAmount,
                        customerName,
                        phone,
                        address,
                        paymentMethod: paymentMethod || "cod",
                        paymentStatus: "pending",
                        status: "pending"
                    }
                ],
                { session }
            );

            createdOrder = orders[0];
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: createdOrder
        });

    } catch (error) {
        console.error("Create order error:", error);

        res.status(400).json({
            success: false,
            message: error.message || "Failed to place order"
        });
    } finally {
        await session.endSession();
    }
};

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

// Get all orders - admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

// Update order status - admin
// Update order status - admin
const updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        let updatedOrder;

        await session.withTransaction(async () => {
            const order = await Order.findById(req.params.id)
                .session(session);

            if (!order) {
                throw new Error("Order not found");
            }

            // If status is not actually changing
            if (order.status === status) {
                updatedOrder = order;
                return;
            }

            // Prevent changing a cancelled order back to another status
            if (order.status === "cancelled") {
                throw new Error(
                    "A cancelled order cannot be changed to another status."
                );
            }

            // Restore stock when cancelling an active order
            if (status === "cancelled") {
                for (const item of order.items) {
                    const product = await Product.findById(item.product)
                        .session(session);

                    if (product) {
                        product.stock += item.quantity;
                        await product.save({ session });
                    }
                }
            }

            order.status = status;

            updatedOrder = await order.save({ session });
        });

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Update order status error:", error);

        const statusCode =
            error.message === "Order not found" ? 404 : 400;

        res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to update order status"
        });

    } finally {
        await session.endSession();
    }
};
// Update payment status - admin
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        // Only these payment statuses are allowed
        const allowedPaymentStatuses = [
            "pending",
            "paid"
        ];

        if (!allowedPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // This shop uses Cash on Delivery only
        if (order.paymentMethod !== "cod") {
            return res.status(400).json({
                success: false,
                message: "Only Cash on Delivery orders are supported"
            });
        }

        // A cancelled order should not be marked as paid
        if (order.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled orders cannot be marked as paid"
            });
        }

        order.paymentStatus = paymentStatus;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            order
        });

    } catch (error) {
        console.error("Update payment status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update payment status",
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus
};