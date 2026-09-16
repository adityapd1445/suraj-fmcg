import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AdminLayout from "../components/AdminLayout";
import API_URL from "../services/api";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                setMessage(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong while loading orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/orders/${orderId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to update order");
                return;
            }

            setMessage("Order status updated successfully!");

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              status: data.order.status
                          }
                        : order
                )
            );
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong");
        }
    };

    const updatePaymentStatus = async (orderId, paymentStatus) => {
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/orders/${orderId}/payment`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ paymentStatus })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to update payment status"
                );
                return;
            }

            setMessage("Payment status updated successfully!");

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              paymentStatus: data.order.paymentStatus
                          }
                        : order
                )
            );
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong");
        }
    };

    const getStatusClass = (status) => {
        const classes = {
            pending: "bg-yellow-100 text-yellow-700",
            confirmed: "bg-blue-100 text-blue-700",
            processing: "bg-purple-100 text-purple-700",
            shipped: "bg-indigo-100 text-indigo-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700"
        };

        return classes[status] || "bg-gray-100 text-gray-700";
    };

    const getPaymentClass = (paymentStatus) => {
        if (paymentStatus === "paid") {
            return "bg-green-100 text-green-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-gray-500">
                        Loading orders...
                    </p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Orders
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage customer orders and payment status.
                    </p>
                </div>

                {message && (
                    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                        {message}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <div className="text-5xl">📦</div>

                        <h2 className="mt-4 text-xl font-semibold text-gray-800">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Customer orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="overflow-hidden rounded-xl bg-white shadow-sm"
                            >
                                {/* Order Header */}
                                <div className="border-b bg-gray-50 p-5">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Order ID
                                            </p>

                                            <p className="mt-1 break-all font-mono text-sm font-semibold text-gray-800">
                                                {order._id}
                                            </p>

                                            <p className="mt-2 text-sm text-gray-500">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentClass(
                                                    order.paymentStatus
                                                )}`}
                                            >
                                                Payment:{" "}
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                        {/* Customer */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                Customer
                                            </h3>

                                            <div className="mt-3 space-y-1 text-sm text-gray-600">
                                                <p>
                                                    <span className="font-medium">
                                                        Name:
                                                    </span>{" "}
                                                    {order.customerName}
                                                </p>

                                                <p>
                                                    <span className="font-medium">
                                                        Phone:
                                                    </span>{" "}
                                                    {order.phone}
                                                </p>

                                                {order.user?.email && (
                                                    <p className="break-all">
                                                        <span className="font-medium">
                                                            Email:
                                                        </span>{" "}
                                                        {order.user.email}
                                                    </p>
                                                )}

                                                <p className="pt-2">
                                                    <span className="font-medium">
                                                        Address:
                                                    </span>
                                                </p>

                                                <p className="leading-6">
                                                    {order.address}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                Items
                                            </h3>

                                            <div className="mt-3 space-y-3">
                                                {order.items.map(
                                                    (item, index) => (
                                                        <div
                                                            key={`${order._id}-${index}`}
                                                            className="flex items-center gap-3"
                                                        >
                                                            {item.image ? (
                                                                <img
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    className="h-12 w-12 rounded-lg object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                                                    No
                                                                    Image
                                                                </div>
                                                            )}

                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-sm font-medium text-gray-800">
                                                                    {
                                                                        item.name
                                                                    }
                                                                </p>

                                                                <p className="text-xs text-gray-500">
                                                                    ₹
                                                                    {
                                                                        item.price
                                                                    }{" "}
                                                                    ×{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </p>
                                                            </div>

                                                            <p className="text-sm font-semibold text-gray-800">
                                                                ₹
                                                                {item.price *
                                                                    item.quantity}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            <div className="mt-4 border-t pt-4">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-700">
                                                        Total
                                                    </span>

                                                    <span className="text-lg font-bold text-gray-900">
                                                        ₹{order.totalAmount}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Payment method: Cash on
                                                    Delivery
                                                </p>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                Order Status
                                            </h3>

                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                {[
                                                    "pending",
                                                    "confirmed",
                                                    "processing",
                                                    "shipped",
                                                    "delivered",
                                                    "cancelled"
                                                ].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() =>
                                                            updateStatus(
                                                                order._id,
                                                                status
                                                            )
                                                        }
                                                        disabled={
                                                            order.status ===
                                                                status ||
                                                            order.status ===
                                                                "cancelled"
                                                        }
                                                        className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${
                                                            order.status ===
                                                                status ||
                                                            order.status ===
                                                                "cancelled"
                                                                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="mt-6 border-t pt-5">
                                                <h3 className="font-semibold text-gray-800">
                                                    Payment Status
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Cash on Delivery
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() =>
                                                            updatePaymentStatus(
                                                                order._id,
                                                                "paid"
                                                            )
                                                        }
                                                        disabled={
                                                            order.paymentStatus ===
                                                                "paid" ||
                                                            order.status ===
                                                                "cancelled"
                                                        }
                                                        className={
                                                            order.paymentStatus ===
                                                                "paid" ||
                                                            order.status ===
                                                                "cancelled"
                                                                ? "cursor-not-allowed rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-400"
                                                                : "rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                                                        }
                                                    >
                                                        {order.paymentStatus ===
                                                        "paid"
                                                            ? "✓ Paid"
                                                            : "Mark Paid"}
                                                    </button>

                                                    {order.paymentStatus ===
                                                        "paid" && (
                                                        <button
                                                            onClick={() =>
                                                                updatePaymentStatus(
                                                                    order._id,
                                                                    "pending"
                                                                )
                                                            }
                                                            disabled={
                                                                order.status ===
                                                                "cancelled"
                                                            }
                                                            className="rounded-lg bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700 hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            Mark Pending
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminOrders;

