import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API_URL from "../services/api";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setError("Please login to view your orders.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/orders/my-orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load orders.");
                    return;
                }

                setOrders(data.orders || []);
            } catch (err) {
                console.error(err);
                setError("Something went wrong while loading orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const getStatusClass = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-700";

            case "shipped":
                return "bg-blue-100 text-blue-700";

            case "processing":
                return "bg-yellow-100 text-yellow-700";

            case "confirmed":
                return "bg-indigo-100 text-indigo-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <main className="flex min-h-[70vh] items-center justify-center px-4">
                    <div className="text-center">
                        <div className="text-5xl">🔐</div>

                        <h1 className="mt-5 text-2xl font-bold text-gray-800">
                            Login Required
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Please login to view your orders.
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

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        My Orders
                    </h1>

                    <p className="mt-1 text-gray-500">
                        View your previous and current orders.
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="py-16 text-center">
                        <p className="text-gray-500">
                            Loading your orders...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && orders.length === 0 && (
                    <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">

                        <div className="text-6xl">
                            📦
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-gray-800">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Your orders will appear here after you place one.
                        </p>

                        <Link
                            to="/products"
                            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Start Shopping
                        </Link>

                    </div>
                )}

                {/* Orders */}
                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-6">

                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="overflow-hidden rounded-xl bg-white shadow-sm"
                            >

                                {/* Order Header */}
                                <div className="border-b bg-gray-50 p-4 sm:p-6">

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div>
                                            <p className="text-xs font-medium uppercase text-gray-400">
                                                Order ID
                                            </p>

                                            <p className="mt-1 break-all font-semibold text-gray-800">
                                                #{order._id}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase text-gray-400">
                                                Order Date
                                            </p>

                                            <p className="mt-1 text-sm text-gray-700">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </p>
                                        </div>

                                        <div>
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                {/* Items */}
                                <div className="divide-y">

                                    {order.items.map((item, index) => (
                                        <div
                                            key={`${order._id}-${index}`}
                                            className="flex gap-4 p-4 sm:p-6"
                                        >

                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-20 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-24"
                                                />
                                            ) : (
                                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400 sm:h-24 sm:w-24">
                                                    No Image
                                                </div>
                                            )}

                                            <div className="min-w-0 flex-1">

                                                <h3 className="font-semibold text-gray-800">
                                                    {item.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    ₹{item.price} × {item.quantity}
                                                </p>

                                                <p className="mt-2 font-semibold text-gray-800">
                                                    ₹{item.price * item.quantity}
                                                </p>

                                            </div>

                                        </div>
                                    ))}

                                </div>

                                {/* Order Footer */}
                                <div className="border-t p-4 sm:p-6">

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                                        <div>
                                            <p className="text-xs uppercase text-gray-400">
                                                Payment
                                            </p>

                                            <p className="mt-1 font-medium capitalize text-gray-700">
                                                {order.paymentMethod === "cod"
                                                    ? "Cash on Delivery"
                                                    : "Online Payment"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-gray-400">
                                                Payment Status
                                            </p>

                                            <p className="mt-1 font-medium capitalize text-gray-700">
                                                {order.paymentStatus}
                                            </p>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="text-xs uppercase text-gray-400">
                                                Total
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-gray-900">
                                                ₹{order.totalAmount}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-5">
                                        <p className="text-xs uppercase text-gray-400">
                                            Delivery Address
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {order.address}
                                        </p>
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </main>

        </div>
    );
}

export default MyOrders;

