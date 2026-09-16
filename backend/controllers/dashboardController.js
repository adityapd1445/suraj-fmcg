const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Basic counts
        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const totalCustomers = await User.countDocuments({
            role: "customer"
        });

        // Get all orders for sales calculation
        const orders = await Order.find({
            status: { $ne: "cancelled" }
        });

        const totalSales = orders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
        );

        // Recent orders
        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        // Low-stock products
        const lowStockProducts = await Product.find({
            stock: { $lte: 5 }
        })
            .sort({ stock: 1 })
            .limit(10);

        res.status(200).json({
            success: true,

            stats: {
                totalProducts,
                totalOrders,
                totalCustomers,
                totalSales
            },

            recentOrders,

            lowStockProducts
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};