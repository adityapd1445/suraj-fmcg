const express = require("express");

const {
    getAllCustomers
} = require("../controllers/customerController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    protect,
    adminOnly,
    getAllCustomers
);

module.exports = router;