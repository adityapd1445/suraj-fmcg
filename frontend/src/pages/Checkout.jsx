import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import API_URL from "../services/api";

function Checkout() {
    const {
        cartItems,
        cartCount,
        cartTotal,
        clearCart
    } = useCart();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        address: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            const items = cartItems.map((item) => ({
                productId: item._id,
                quantity: item.quantity
            }));

            const response = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    items,
                    customerName: formData.customerName,
                    phone: formData.phone,
                    address: formData.address,
                    paymentMethod: "cod"
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to place order");
                return;
            }

            clearCart();

            navigate("/orders");

        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">

                <Navbar />

                <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">

                    <div className="text-center">

                        <div className="text-6xl">
                            🛒
                        </div>

                        <h1 className="mt-5 text-2xl font-bold text-gray-800">
                            Your cart is empty
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Add some products before checking out.
                        </p>

                        <Link
                            to="/products"
                            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Browse Products
                        </Link>

                    </div>

                </main>

            </div>
        );
    }

    // Not logged in
    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50">

                <Navbar />

                <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">

                    <div className="text-center">

                        <div className="text-5xl">
                            🔐
                        </div>

                        <h1 className="mt-5 text-2xl font-bold text-gray-800">
                            Login required
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Please login to place your order.
                        </p>

                        <Link
                            to="/login"
                            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Login
                        </Link>

                    </div>

                </main>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Checkout
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Enter your delivery details to place your order.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-8 lg:grid-cols-3"
                >

                    {/* Delivery Details */}
                    <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">

                        <h2 className="text-xl font-bold text-gray-800">
                            Delivery Details
                        </h2>

                        <div className="mt-6 space-y-5">

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your 10-digit mobile number"
                                    autoComplete="tel"
                                    required
                                    pattern="[0-9]{10}"
                                    maxLength="10"
                                    inputMode="numeric"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    Enter a 10-digit mobile number.
                                </p>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Delivery Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="House number, street, area, city, PIN code..."
                                    autoComplete="street-address"
                                    required
                                    rows="5"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Payment Method */}
                            <div>

                                <label className="mb-3 block text-sm font-medium text-gray-700">
                                    Payment Method
                                </label>

                                <div className="rounded-xl border border-green-200 bg-green-50 p-5">

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                                            💵
                                        </div>

                                        <div>

                                            <p className="font-semibold text-gray-800">
                                                Cash on Delivery
                                            </p>

                                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                                Pay in cash when your order is
                                                delivered to you.
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-green-700">
                                                No online payment required.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Order Summary */}
                    <div>

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-bold text-gray-800">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-4">

                                {cartItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between gap-4 text-sm"
                                    >

                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800">
                                                {item.name}
                                            </p>

                                            <p className="text-gray-500">
                                                ₹{item.price} × {item.quantity}
                                            </p>
                                        </div>

                                        <p className="shrink-0 font-medium text-gray-800">
                                            ₹{item.price * item.quantity}
                                        </p>

                                    </div>
                                ))}

                            </div>

                            <div className="mt-6 border-t pt-5">

                                <div className="flex justify-between text-gray-600">
                                    <span>
                                        Items
                                    </span>

                                    <span>
                                        {cartCount}
                                    </span>
                                </div>

                                <div className="mt-3 flex justify-between text-gray-600">
                                    <span>
                                        Delivery
                                    </span>

                                    <span className="font-medium text-green-600">
                                        Free
                                    </span>
                                </div>

                                <div className="mt-4 flex justify-between border-t pt-4">

                                    <span className="text-lg font-bold text-gray-800">
                                        Total
                                    </span>

                                    <span className="text-xl font-bold text-gray-900">
                                        ₹{cartTotal}
                                    </span>

                                </div>

                            </div>

                            <div className="mt-5 rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-600">
                                💵 Pay ₹{cartTotal} when your order is delivered.
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                            >
                                {loading
                                    ? "Placing Order..."
                                    : `Place Order • ₹${cartTotal}`}
                            </button>

                            <Link
                                to="/cart"
                                className="mt-3 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                ← Back to Cart
                            </Link>

                        </div>

                    </div>

                </form>

            </main>

        </div>
    );
}

export default Checkout;

