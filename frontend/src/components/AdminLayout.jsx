import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function AdminLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Mobile Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={closeMenu}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gray-900 text-white shadow-xl transition-transform duration-300 md:hidden ${
                    menuOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >

                {/* Logo */}
                <div className="flex items-start justify-between border-b border-gray-700 px-5 py-5">

                    <div>
                        <h1 className="text-xl font-bold">
                            🛍️ Suraj FMCG
                        </h1>

                        <p className="mt-1 text-xs text-gray-400">
                            Wholesale • Distribution • Supply
                        </p>

                        <p className="mt-2 text-sm text-gray-400">
                            Admin Panel
                        </p>
                    </div>

                    <button
                        onClick={closeMenu}
                        className="rounded-lg px-2 py-1 text-2xl text-gray-400 hover:bg-gray-800 hover:text-white"
                        aria-label="Close menu"
                    >
                        ×
                    </button>

                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 space-y-2 px-4 py-6">

                    <Link
                        to="/admin"
                        onClick={closeMenu}
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        📊 Dashboard
                    </Link>

                    <Link
                        to="/admin/products"
                        onClick={closeMenu}
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin/products")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        📦 Products
                    </Link>

                    <Link
                        to="/admin/orders"
                        onClick={closeMenu}
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin/orders")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        🛒 Orders
                    </Link>

                    <Link
                        to="/admin/customers"
                        onClick={closeMenu}
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin/customers")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        👥 Customers
                    </Link>
                    <Link
                        to="/admin/daily-sales"
                        onClick={closeMenu}
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin/daily-sales")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        💰 Daily Sales
                    </Link>
                </nav>

                {/* Mobile User */}
                <div className="border-t border-gray-700 p-4">

                    <p className="text-sm font-semibold">
                        {user?.name}
                    </p>

                    <p className="mb-3 mt-1 break-all text-xs text-gray-400">
                        {user?.email}
                    </p>

                    <button
                        onClick={logout}
                        className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium transition hover:bg-red-700"
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-gray-900 text-white md:flex">

                {/* Logo */}
                <div className="border-b border-gray-700 px-6 py-6">

                    <h1 className="text-2xl font-bold">
                        🛍️ Suraj FMCG
                    </h1>

                    <p className="mt-1 text-xs font-medium tracking-wide text-blue-400">
                        WHOLESALE • DISTRIBUTION • SUPPLY
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                        Admin Panel
                    </p>

                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 px-4 py-6">

                    <Link
                        to="/admin"
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        📊 Dashboard
                    </Link>

                    <Link
                        to="/admin/products"
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin/products")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        📦 Products
                    </Link>

                    <Link
                        to="/admin/orders"
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin/orders")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        🛒 Orders
                    </Link>

                    <Link
                        to="/admin/customers"
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin/customers")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        👥 Customers
                    </Link>
                    <Link
                        to="/admin/daily-sales"
                        className={`block rounded-lg px-4 py-3 transition ${
                            isActive("/admin/daily-sales")
                                ? "bg-white font-semibold text-gray-900"
                                : "text-gray-300 hover:bg-gray-800"
                        }`}
                    >
                        💰 Daily Sales
                    </Link>

                </nav>

                {/* Desktop User */}
                <div className="border-t border-gray-700 p-4">

                    <p className="text-sm font-semibold">
                        {user?.name}
                    </p>

                    <p className="mb-3 mt-1 break-all text-xs text-gray-400">
                        {user?.email}
                    </p>

                    <button
                        onClick={logout}
                        className="w-full rounded-lg bg-red-600 px-4 py-2 transition hover:bg-red-700"
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* Main Content */}
            <main className="min-h-screen md:ml-64">

                {/* Top Bar */}
                <header className="sticky top-0 z-30 border-b bg-white">

                    <div className="flex min-h-20 items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-3 md:hidden">

                            <button
                                onClick={() => setMenuOpen(true)}
                                className="rounded-lg border border-gray-200 bg-white p-2 text-xl text-gray-700 shadow-sm hover:bg-gray-50"
                                aria-label="Open menu"
                            >
                                ☰
                            </button>

                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Suraj FMCG
                                </h2>

                                <p className="text-[10px] font-medium tracking-wide text-gray-500">
                                    WHOLESALE • DISTRIBUTION • SUPPLY
                                </p>
                            </div>

                        </div>

                        {/* Desktop Header */}
                        <div className="hidden md:block">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Admin Dashboard
                            </h2>

                            <p className="text-sm text-gray-500">
                                Manage Suraj FMCG
                            </p>

                        </div>

                        {/* User */}
                        <div className="text-right">

                            <p className="text-sm font-semibold text-gray-800 sm:text-base">
                                {user?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                Administrator
                            </p>

                        </div>

                    </div>

                </header>


                {/* Page */}
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

            </main>

        </div>
    );
}

export default AdminLayout;