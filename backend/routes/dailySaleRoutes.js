const express = require("express");

const {
    createSale,
    getTodaySales,
    getSales,
    getSale
} = require("../controllers/saleController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create a physical shop sale
router.post(
    "/",
    protect,
    adminOnly,
    createSale
);

// Get today's sales
router.get(
    "/today",
    protect,
    adminOnly,
    getTodaySales
);

// Get complete sales history
router.get(
    "/",
    protect,
    adminOnly,
    getSales
);

// Get one particular bill
router.get(
    "/:id",
    protect,
    adminOnly,
    getSale
);

module.exports = router;