const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        total: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { _id: false }
);

const saleSchema = new mongoose.Schema(
    {
        billNumber: {
            type: String,
            required: true,
            unique: true
        },

        customerName: {
            type: String,
            default: "Walk-in Customer",
            trim: true
        },

        items: {
            type: [saleItemSchema],
            required: true
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "credit"],
            default: "cash"
        },

        saleDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;