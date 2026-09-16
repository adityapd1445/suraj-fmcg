const express = require("express");

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// Public routes

// Get all products
router.get("/", getProducts);

// Get one product
router.get("/:id", getProduct);


// Admin routes

// Create product
router.post("/", protect, adminOnly, createProduct);

// Update product
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product
router.delete("/:id", protect, adminOnly, deleteProduct);


module.exports = router;