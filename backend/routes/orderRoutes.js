const express = require("express");

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus
} = require("../controllers/orderController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Customer
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin
router.get("/", protect, adminOnly, getAllOrders);

router.put(
    "/:id/status",
    protect,
    adminOnly,
    updateOrderStatus
);
router.put(
    "/:id/payment",
    protect,
    adminOnly,
    updatePaymentStatus
);

module.exports = router;