const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        const email = "admin@shop.com";
        const password = "Admin@12345";

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("A user with this email already exists.");

            if (existingAdmin.role !== "admin") {
                existingAdmin.role = "admin";
                await existingAdmin.save();

                console.log("Existing user has been promoted to admin.");
            } else {
                console.log("User is already an admin.");
            }

            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name: "Shop Admin",
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully!");
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:");
        console.error(error.message);

        process.exit(1);
    }
};

createAdmin();