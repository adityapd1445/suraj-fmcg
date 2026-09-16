import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import API_URL from "../services/api";

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch(`${API_URL}/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load dashboard");
                    return;
                }

                setDashboard(data);
            } catch (error) {
                console.error(error);
                setError("Something went wrong while loading dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [token]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex min-h-[50vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

                        <p className="mt-4 text-sm text-gray-500">
                            Loading dashboard...
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700 sm:p-6">
                    {error}
                </div>
            </AdminLayout>
        );
    }

    const stats = dashboard?.stats || {};
    const recentOrders = dashboard?.recentOrders || [];
    const lowStockProducts = dashboard?.lowStockProducts || [];

    return (
        <AdminLayout>

            <div className="space-y-6 sm:space-y-8">

                {/* Header */}
                <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 sm:text-sm">
                        Suraj FMCG
                    </p>

                    <h1 className="mt-1 text-2xl font-extrabold text-gray-800 sm:text-3xl">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 sm:text-base">
                        Here's what's happening in your business.
                    </p>

                </div>


                {/* Statistics */}
                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

                    {/* Products */}
                    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">

                        <div className="flex items-center justify-between gap-2">

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                                    Total Products
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                                    {stats.totalProducts || 0}
                                </p>

                            </div>

                            <div className="shrink-0 rounded-full bg-blue-100 p-2 text-xl sm:p-3 sm:text-2xl">
                                📦
                            </div>

                        </div>

                    </div>


                    {/* Orders */}
                    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">

                        <div className="flex items-center justify-between gap-2">

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                                    Total Orders
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                                    {stats.totalOrders || 0}
                                </p>

                            </div>

                            <div className="shrink-0 rounded-full bg-green-100 p-2 text-xl sm:p-3 sm:text-2xl">
                                🛒
                            </div>

                        </div>

                    </div>


                    {/* Customers */}
                    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">

                        <div className="flex items-center justify-between gap-2">

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                                    Customers
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                                    {stats.totalCustomers || 0}
                                </p>

                            </div>

                            <div className="shrink-0 rounded-full bg-purple-100 p-2 text-xl sm:p-3 sm:text-2xl">
                                👥
                            </div>

                        </div>

                    </div>


                    {/* Sales */}
                    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">

                        <div className="flex items-center justify-between gap-2">

                            <div className="min-w-0">

                                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                                    Total Sales
                                </p>

                                <p className="mt-2 truncate text-2xl font-bold text-gray-800 sm:text-3xl">
                                    &#8377;{stats.totalSales || 0}
                                </p>

                            </div>

                            <div className="shrink-0 rounded-full bg-yellow-100 p-2 text-xl sm:p-3 sm:text-2xl">
                                💰
                            </div>

                        </div>

                    </div>

                </div>


                {/* Recent Orders + Low Stock */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {/* Recent Orders */}
                    <div className="min-w-0 overflow-hidden rounded-xl bg-white shadow-sm">

                        <div className="border-b px-4 py-5 sm:p-6">

                            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                Recent Orders
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Latest customer orders
                            </p>

                        </div>

                        {recentOrders.length === 0 ? (

                            <div className="p-6 text-center text-sm text-gray-500">
                                No orders yet.
                            </div>

                        ) : (

                            <div className="divide-y">

                                {recentOrders.map((order) => (

                                    <div
                                        key={order._id}
                                        className="p-4 sm:p-5"
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            {/* Order Information */}
                                            <div className="min-w-0 flex-1">

                                                <p className="truncate font-semibold text-gray-800">
                                                    {order.customerName}
                                                </p>

                                                <p className="mt-1 break-all text-xs text-gray-500 sm:text-sm">
                                                    Order #{order._id}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </p>

                                            </div>


                                            {/* Amount + Status */}
                                            <div className="shrink-0 text-right">

                                                <p className="text-sm font-bold text-gray-800 sm:text-base">
                                                    &#8377;{order.totalAmount}
                                                </p>

                                                <span
                                                    className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize sm:px-3 sm:text-xs ${
                                                        order.status === "delivered"
                                                            ? "bg-green-50 text-green-600"
                                                            : order.status === "cancelled"
                                                            ? "bg-red-50 text-red-600"
                                                            : order.status === "shipped"
                                                            ? "bg-blue-50 text-blue-600"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* Low Stock */}
                    <div className="min-w-0 overflow-hidden rounded-xl bg-white shadow-sm">

                        <div className="border-b px-4 py-5 sm:p-6">

                            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                Low Stock
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Products with 5 or fewer units
                            </p>

                        </div>

                        {lowStockProducts.length === 0 ? (

                            <div className="flex min-h-40 items-center justify-center p-6 text-center">

                                <div>

                                    <div className="text-3xl">
                                        📦
                                    </div>

                                    <p className="mt-2 text-sm text-gray-500">
                                        No low-stock products.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="divide-y">

                                {lowStockProducts.map((product) => (

                                    <div
                                        key={product._id}
                                        className="flex items-center justify-between gap-3 p-4 sm:p-5"
                                    >

                                        <div className="min-w-0 flex-1">

                                            <p className="truncate font-semibold text-gray-800">
                                                {product.name}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-gray-500 sm:text-sm">
                                                {product.category}
                                            </p>

                                        </div>

                                        <div className="shrink-0 text-right">

                                            <p className="text-sm font-bold text-red-600 sm:text-base">
                                                {product.stock} left
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                &#8377;{product.price}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>


                {/* Business Information */}
                <div className="rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white shadow-sm sm:p-6">

                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                        Suraj FMCG
                    </p>

                    <h2 className="mt-1 text-lg font-bold sm:text-xl">
                        Wholesale • Distribution • Supply
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-blue-100">
                        Manage your products, customer orders and stock
                        from the admin panel.
                    </p>

                </div>

            </div>

        </AdminLayout>
    );
}

export default AdminDashboard;