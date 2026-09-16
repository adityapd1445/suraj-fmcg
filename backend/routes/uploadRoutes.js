const express = require("express");

const {
    uploadProductImage
} = require("../controllers/uploadController");

const upload = require("../middleware/uploadMiddleware");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/product-image",
    protect,
    adminOnly,
    upload.single("image"),
    uploadProductImage
);

module.exports = router;
