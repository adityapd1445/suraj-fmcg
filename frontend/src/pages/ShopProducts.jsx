import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import API_URL from "../services/api";

function ShopProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

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

    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(products.map((product) => product.category))
        ];

        return ["All", ...uniqueCategories];
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                product.description
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                category === "All" ||
                product.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, category]);

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            {/* Header */}
            <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

                    <div className="max-w-3xl">

                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
                            Suraj FMCG
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                            FMCG Products
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                            Browse our range of everyday FMCG products
                            available through Suraj FMCG.
                        </p>

                        <div className="mt-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur sm:text-sm">
                            Wholesale • Distribution • Supply
                        </div>

                    </div>

                </div>
            </section>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Search + Filter */}
                <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">

                    <div className="mb-5">

                        <h2 className="text-lg font-bold text-gray-800">
                            Find Products
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Search by product name or select a category.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* Search */}
                        <div className="md:col-span-2">

                            <label
                                htmlFor="product-search"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Search Products
                            </label>

                            <div className="relative">

                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>

                                <input
                                    id="product-search"
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search biscuits, noodles, chocolates..."
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                />

                            </div>

                        </div>

                        {/* Category */}
                        <div>

                            <label
                                htmlFor="category"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Category
                            </label>

                            <select
                                id="category"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            >
                                {categories.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </div>

                </div>

                {/* Results Header */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                    <div>

                        <p className="text-sm font-medium text-gray-600">
                            {filteredProducts.length} product
                            {filteredProducts.length !== 1 ? "s" : ""}
                            {" "}available
                        </p>

                        {(search || category !== "All") && (
                            <p className="mt-1 text-xs text-gray-400">
                                Showing filtered results
                            </p>
                        )}

                    </div>

                    {(search || category !== "All") && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setCategory("All");
                            }}
                            className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                            Clear Filters
                        </button>
                    )}

                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm"
                            >

                                <div className="h-40 bg-gray-200 sm:h-48"></div>

                                <div className="p-4">

                                    <div className="h-3 w-20 rounded bg-gray-200"></div>

                                    <div className="mt-3 h-4 w-32 rounded bg-gray-200"></div>

                                    <div className="mt-4 h-5 w-20 rounded bg-gray-200"></div>

                                    <div className="mt-4 h-10 rounded bg-gray-200"></div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

                {/* No products */}
                {!loading && filteredProducts.length === 0 && (
                    <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">

                        <div className="text-5xl">
                            🔍
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-gray-800">
                            No products found
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Try a different product name or category.
                        </p>

                        <button
                            onClick={() => {
                                setSearch("");
                                setCategory("All");
                            }}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            View All Products
                        </button>

                    </div>
                )}

                {/* Product Grid */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* Image */}
                                <Link
                                    to={`/products/${product._id}`}
                                    className="block overflow-hidden"
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

                                </Link>

                                {/* Details */}
                                <div className="p-4">

                                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 sm:text-xs">
                                        {product.category}
                                    </p>

                                    <Link
                                        to={`/products/${product._id}`}
                                        className="mt-1 block min-h-10 text-sm font-bold text-gray-800 transition hover:text-blue-600 sm:text-base"
                                    >
                                        {product.name}
                                    </Link>

                                    {product.description && (
                                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                            {product.description}
                                        </p>
                                    )}

                                    <div className="mt-4 flex items-center justify-between gap-2">

                                        <span className="text-base font-extrabold text-gray-900 sm:text-lg">
                                            &#8377;{product.price}
                                        </span>

                                        {product.stock > 0 ? (
                                            <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600 sm:text-xs">
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 sm:text-xs">
                                                Out of Stock
                                            </span>
                                        )}

                                    </div>

                                    {/* Button */}
                                    <button
                                        disabled={product.stock === 0}
                                        onClick={() => addToCart(product)}
                                        className={
                                            product.stock === 0
                                                ? "mt-4 w-full cursor-not-allowed rounded-lg bg-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-400 sm:text-sm"
                                                : "mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] sm:text-sm"
                                        }
                                    >
                                        {product.stock === 0
                                            ? "Out of Stock"
                                            : "Add to Cart"}
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="bg-gray-950 px-4 py-10 text-gray-400">

                <div className="mx-auto max-w-7xl">

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                        {/* Brand */}
                        <div>

                            <h3 className="text-xl font-bold text-white">
                                Suraj FMCG
                            </h3>

                            <p className="mt-2 text-xs font-semibold tracking-wider text-blue-400">
                                WHOLESALE • DISTRIBUTION • SUPPLY
                            </p>

                            <p className="mt-4 max-w-sm text-sm leading-6">
                                Your trusted source for everyday FMCG
                                products and wholesale supply.
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
                                    className="transition hover:text-white"
                                >
                                    Home
                                </Link>

                                <Link
                                    to="/products"
                                    className="transition hover:text-white"
                                >
                                    Products
                                </Link>

                                <Link
                                    to="/cart"
                                    className="transition hover:text-white"
                                >
                                    Cart
                                </Link>

                                <Link
                                    to="/orders"
                                    className="transition hover:text-white"
                                >
                                    My Orders
                                </Link>

                            </div>

                        </div>

                        {/* Business */}
                        <div>

                            <h4 className="font-semibold text-white">
                                Business
                            </h4>

                            <p className="mt-4 text-sm leading-6">
                                Wholesale • Distribution • Supply
                            </p>

                            <p className="mt-2 text-sm leading-6">
                                Browse our available FMCG products and
                                place your order online.
                            </p>

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

export default ShopProducts;