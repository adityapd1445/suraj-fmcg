import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import API_URL from "../services/api";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/products/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Product not found");
                    return;
                }

                setProduct(data.product);
            } catch (error) {
                console.error(error);
                setError("Unable to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-gray-500">
                        Loading product...
                    </p>
                </div>
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Navbar />

                <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                    <div className="text-6xl">📦</div>

                    <h1 className="mt-4 text-2xl font-bold text-gray-800">
                        Product not found
                    </h1>

                    <p className="mt-2 text-gray-500">
                        {error || "This product does not exist."}
                    </p>

                    <Link
                        to="/products"
                        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                    >
                        Back to Products
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-6xl">

                    {/* Breadcrumb */}
                    <div className="mb-6 text-sm text-gray-500">
                        <Link
                            to="/"
                            className="hover:text-blue-600"
                        >
                            Home
                        </Link>

                        <span className="mx-2">/</span>

                        <Link
                            to="/products"
                            className="hover:text-blue-600"
                        >
                            Products
                        </Link>

                        <span className="mx-2">/</span>

                        <span className="text-gray-700">
                            {product.name}
                        </span>
                    </div>

                    {/* Product */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                        <div className="grid grid-cols-1 lg:grid-cols-2">

                            {/* Image */}
                            <div className="flex min-h-[320px] items-center justify-center bg-gray-100 p-6 sm:min-h-[450px]">

                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="max-h-[450px] w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <div className="text-7xl">
                                            📦
                                        </div>

                                        <p className="mt-3 text-gray-400">
                                            No image available
                                        </p>
                                    </div>
                                )}

                            </div>

                            {/* Information */}
                            <div className="p-6 sm:p-10">

                                <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
                                    {product.category}
                                </p>

                                <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                                    {product.name}
                                </h1>

                                <p className="mt-5 text-3xl font-bold text-gray-900">
                                    ₹{product.price}
                                </p>

                                <div className="mt-6 border-t pt-6">

                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Description
                                    </h2>

                                    <p className="mt-3 leading-7 text-gray-600">
                                        {product.description ||
                                            "No description available for this product."}
                                    </p>

                                </div>

                                {/* Stock */}
                                <div className="mt-6">

                                    {product.stock > 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>

                                            <span className="font-medium text-green-700">
                                                In Stock
                                            </span>

                                            <span className="text-sm text-gray-500">
                                                ({product.stock} available)
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>

                                            <span className="font-medium text-red-600">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}

                                </div>

                                {/* Quantity + Cart */}
                                {product.stock > 0 && (
                                    <div className="mt-7">

                                        <p className="mb-3 text-sm font-medium text-gray-700">
                                            Quantity
                                        </p>

                                        <div className="flex flex-col gap-4 sm:flex-row">

                                            <div className="flex h-12 w-fit items-center overflow-hidden rounded-lg border border-gray-300">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setQuantity(
                                                            Math.max(
                                                                1,
                                                                quantity - 1
                                                            )
                                                        )
                                                    }
                                                    className="h-full w-12 text-xl text-gray-600 hover:bg-gray-100"
                                                >
                                                    −
                                                </button>

                                                <span className="flex h-full w-12 items-center justify-center border-x border-gray-300 font-semibold">
                                                    {quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setQuantity(
                                                            Math.min(
                                                                product.stock,
                                                                quantity + 1
                                                            )
                                                        )
                                                    }
                                                    className="h-full w-12 text-xl text-gray-600 hover:bg-gray-100"
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleAddToCart}
                                                className="h-12 flex-1 rounded-lg bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
                                            >
                                                Add {quantity} to Cart
                                            </button>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => navigate("/cart")}
                                            className="mt-3 w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            View Cart
                                        </button>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </main>
        </>
    );
}

export default ProductDetails;

