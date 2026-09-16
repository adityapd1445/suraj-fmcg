const User = require("../models/User");
const Order = require("../models/Order");

// Get all customers - admin
const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({
            role: "customer"
        })
            .select("-password")
            .sort({ createdAt: -1 });

        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {
                const orders = await Order.find({
                    user: customer._id
                });

                const totalOrders = orders.length;

                const totalSpent = orders
                    .filter((order) => order.status !== "cancelled")
                    .reduce(
                        (sum, order) => sum + order.totalAmount,
                        0
                    );

                return {
                    _id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    createdAt: customer.createdAt,
                    totalOrders,
                    totalSpent
                };
            })
        );

        res.status(200).json({
            success: true,
            count: customersWithStats.length,
            customers: customersWithStats
        });

    } catch (error) {
        console.error("Get customers error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customers",
            error: error.message
        });
    }
};

module.exports = {
    getAllCustomers
};