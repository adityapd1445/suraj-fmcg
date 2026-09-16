import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { cartCount } = useCart();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex flex-col leading-tight"
                >
                    <span className="text-xl font-extrabold text-blue-600 sm:text-2xl">
                        Suraj FMCG
                    </span>

                    <span className="text-[9px] font-medium tracking-wider text-gray-500 sm:text-[10px]">
                        WHOLESALE • DISTRIBUTION • SUPPLY
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 md:flex">

                    <Link
                        to="/"
                        className="font-medium text-gray-700 hover:text-blue-600"
                    >
                        Home
                    </Link>

                    <Link
                        to="/orders"
                        className="font-medium text-gray-700 hover:text-blue-600"
                    >
                        My Orders
                    </Link>

                    <Link
                        to="/products"
                        className="font-medium text-gray-700 hover:text-blue-600"
                    >
                        Products
                    </Link>

                    <Link
                        to="/cart"
                        className="relative font-medium text-gray-700 hover:text-blue-600"
                    >
                        🛒 Cart

                        {cartCount > 0 && (
                            <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {token ? (
                        <>
                            <span className="text-sm text-gray-500">
                                Hi, {user?.name}
                            </span>

                            {user?.role === "admin" && (
                                <Link
                                    to="/admin"
                                    className="font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Admin
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            Login
                        </Link>
                    )}

                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rounded-lg p-2 text-2xl text-gray-700 md:hidden"
                    aria-label="Toggle menu"
                >
                    ☰
                </button>

            </div>

            {/* Mobile Navigation */}
            {menuOpen && (
                <div className="border-t bg-white px-4 py-4 md:hidden">

                    <div className="flex flex-col gap-4">

                        <Link
                            to="/"
                            onClick={() => setMenuOpen(false)}
                            className="font-medium text-gray-700"
                        >
                            Home
                        </Link>

                        <Link
                            to="/orders"
                            onClick={() => setMenuOpen(false)}
                            className="font-medium text-gray-700"
                        >
                            My Orders
                        </Link>

                        <Link
                            to="/products"
                            onClick={() => setMenuOpen(false)}
                            className="font-medium text-gray-700"
                        >
                            Products
                        </Link>

                        <Link
                            to="/cart"
                            onClick={() => setMenuOpen(false)}
                            className="font-medium text-gray-700"
                        >
                            🛒 Cart

                            {cartCount > 0 && (
                                <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {token ? (
                            <>
                                <div className="text-sm text-gray-500">
                                    Hi, {user?.name}
                                </div>

                                {user?.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                        className="font-medium text-blue-600"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="w-fit rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="w-fit rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
                            >
                                Login
                            </Link>
                        )}

                    </div>

                </div>
            )}
        </nav>
    );
}

export default Navbar;

