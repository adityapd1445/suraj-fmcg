import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API_URL from "../services/api";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                const data = await response.json();

                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

                    <div className="grid items-center gap-10 lg:grid-cols-2">

                        {/* Hero Text */}
                        <div>

                            <div className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
                                Wholesale • Distribution • Supply
                            </div>

                            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                                Suraj FMCG
                            </h1>

                            <p className="mt-4 text-2xl font-semibold text-blue-100 sm:text-3xl">
                                Your Trusted FMCG Supply Partner
                            </p>

                            <p className="mt-5 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                                A wholesale and distribution platform for everyday
                                FMCG products. Browse our product range and place
                                your order conveniently online.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">

                                <Link
                                    to="/products"
                                    className="rounded-lg bg-white px-6 py-3 font-bold text-blue-700 shadow-lg transition hover:bg-gray-100"
                                >
                                    Browse Products →
                                </Link>

                                <Link
                                    to="/cart"
                                    className="rounded-lg border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
                                >
                                    View Cart
                                </Link>

                            </div>

                        </div>

                        {/* Hero Info Card */}
                        <div className="hidden lg:block">

                            <div className="rounded-2xl bg-white/10 p-6 shadow-xl backdrop-blur-md">

                                <div className="rounded-xl bg-white p-6">

                                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                        Suraj FMCG
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                        Wholesale & Distribution
                                    </h2>

                                    <p className="mt-3 text-gray-600">
                                        Everyday FMCG products for retailers,
                                        businesses and customers.
                                    </p>

                                    <div className="mt-6 grid grid-cols-2 gap-3">

                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <div className="text-2xl">📦</div>
                                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                                FMCG Products
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <div className="text-2xl">🚚</div>
                                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                                Wholesale Supply
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <div className="text-2xl">🛒</div>
                                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                                Easy Ordering
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <div className="text-2xl">🤝</div>
                                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                                Business Supply
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* Categories */}
            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

                <div className="text-center">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Product Categories
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Explore Our FMCG Range
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                        Browse different categories and find the products
                        you need for your business.
                    </p>

                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

                    <Link
                        to="/products"
                        className="group rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-3xl">
                            🍪
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-800">
                            Biscuits
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            View Products
                        </p>
                    </Link>

                    <Link
                        to="/products"
                        className="group rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-3xl">
                            🍫
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-800">
                            Chocolates
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            View Products
                        </p>
                    </Link>

                    <Link
                        to="/products"
                        className="group rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50 text-3xl">
                            🍜
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-800">
                            Noodles
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            View Products
                        </p>
                    </Link>

                    <Link
                        to="/products"
                        className="group rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-3xl">
                            🥤
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-800">
                            Beverages
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            View Products
                        </p>
                    </Link>

                    <Link
                        to="/products"
                        className="group rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl">
                            🛍️
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-800">
                            Grocery
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            View Products
                        </p>
                    </Link>

                    <Link
                        to="/products"
                        className="group rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-3xl">
                            📦
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-800">
                            All Products
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            Browse All →
                        </p>
                    </Link>

                </div>

            </section>

            {/* Business Banner */}
            <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">

                <div className="overflow-hidden rounded-2xl bg-gray-900">

                    <div className="px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-12">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                Wholesale & Distribution
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                                Your FMCG supply, made simpler.
                            </h2>

                            <p className="mt-3 max-w-2xl text-gray-400">
                                Browse our available products and place your
                                order through the Suraj FMCG online store.
                            </p>

                        </div>

                        <Link
                            to="/products"
                            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 lg:mt-0"
                        >
                            View Products →
                        </Link>

                    </div>

                </div>

            </section>

            {/* Featured Products */}
            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

                <div className="flex items-end justify-between">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Our Products
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                            Featured Products
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Explore products currently available.
                        </p>

                    </div>

                    <Link
                        to="/products"
                        className="hidden font-semibold text-blue-600 hover:text-blue-700 sm:block"
                    >
                        View All →
                    </Link>

                </div>

                {loading ? (
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm"
                            >
                                <div className="h-40 bg-gray-200 sm:h-48"></div>

                                <div className="p-4">
                                    <div className="h-3 w-20 rounded bg-gray-200"></div>
                                    <div className="mt-3 h-4 w-32 rounded bg-gray-200"></div>
                                    <div className="mt-4 h-5 w-16 rounded bg-gray-200"></div>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : products.length === 0 ? (
                    <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">

                        <div className="text-4xl">📦</div>

                        <h3 className="mt-3 font-semibold text-gray-800">
                            No products available
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Products will appear here once they are added.
                        </p>

                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {products.slice(0, 8).map((product) => (
                            <Link
                                key={product._id}
                                to={`/products/${product._id}`}
                                className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-40 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-48"
                                    />
                                ) : (
                                    <div className="flex h-40 items-center justify-center bg-gray-100 text-sm text-gray-400 sm:h-48">
                                        No Image
                                    </div>
                                )}

                                <div className="p-4">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                        {product.category}
                                    </p>

                                    <h3 className="mt-1 line-clamp-2 font-semibold text-gray-800">
                                        {product.name}
                                    </h3>

                                    <div className="mt-3 flex items-center justify-between gap-2">

                                        <span className="text-lg font-bold text-gray-900">
                                            &#8377;{product.price}
                                        </span>

                                        {product.stock > 0 ? (
                                            <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                                                Out of Stock
                                            </span>
                                        )}

                                    </div>

                                </div>

                            </Link>
                        ))}

                    </div>
                )}

                <div className="mt-6 text-center sm:hidden">

                    <Link
                        to="/products"
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        View All Products →
                    </Link>

                </div>

            </section>

            {/* Footer */}
            <footer className="bg-gray-950 px-4 py-10 text-gray-400">

                <div className="mx-auto max-w-7xl">

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                        {/* Brand */}
                        <div>

                            <h3 className="text-xl font-bold text-white">
                                Suraj FMCG
                            </h3>

                            <p className="mt-2 text-sm font-medium text-blue-400">
                                Wholesale • Distribution • Supply
                            </p>

                            <p className="mt-4 max-w-sm text-sm leading-6">
                                Your trusted source for FMCG products,
                                wholesale supply and distribution.
                            </p>

                        </div>

                        {/* Quick Links */}
                        <div>

                            <h4 className="font-semibold text-white">
                                Quick Links
                            </h4>

                            <div className="mt-4 flex flex-col gap-2 text-sm">

                                <Link
                                    to="/"
                                    className="hover:text-white"
                                >
                                    Home
                                </Link>

                                <Link
                                    to="/products"
                                    className="hover:text-white"
                                >
                                    Products
                                </Link>

                                <Link
                                    to="/cart"
                                    className="hover:text-white"
                                >
                                    Cart
                                </Link>

                                <Link
                                    to="/orders"
                                    className="hover:text-white"
                                >
                                    My Orders
                                </Link>

                            </div>

                        </div>

                        {/* Business */}
                        <div>

                            <h4 className="font-semibold text-white">
                                Suraj FMCG
                            </h4>

                            <p className="mt-4 text-sm leading-6">
                                Wholesale • Distribution • Supply
                            </p>

                            <Link
                                to="/products"
                                className="mt-4 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
                            >
                                Browse Products →
                            </Link>

                        </div>

                    </div>

                    <div className="mt-10 border-t border-gray-800 pt-6 text-center">

                        <p className="text-xs">
                            © {new Date().getFullYear()} Suraj FMCG. All rights reserved.
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Home;