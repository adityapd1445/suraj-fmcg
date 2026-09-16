import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cartItems,
        cartCount,
        cartTotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">

                <Navbar />

                <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12">

                    <div className="text-center">

                        <div className="text-6xl">
                            🛒
                        </div>

                        <h1 className="mt-5 text-2xl font-bold text-gray-800 sm:text-3xl">
                            Your cart is empty
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Add some products to your cart to get started.
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

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Shopping Cart
                        </h1>

                        <p className="mt-1 text-gray-500">
                            {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
                        </p>
                    </div>

                    <button
                        onClick={clearCart}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                        Clear Cart
                    </button>

                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* Cart Items */}
                    <div className="space-y-4 lg:col-span-2">

                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="rounded-xl bg-white p-4 shadow-sm sm:p-6"
                            >

                                <div className="flex gap-4">

                                    {/* Image */}
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400 sm:h-32 sm:w-32">
                                            No Image
                                        </div>
                                    )}

                                    {/* Details */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-start justify-between gap-3">

                                            <div>
                                                <p className="text-xs uppercase text-gray-400">
                                                    {item.category}
                                                </p>

                                                <h2 className="mt-1 font-semibold text-gray-800">
                                                    {item.name}
                                                </h2>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeFromCart(item._id)
                                                }
                                                className="text-sm text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>

                                        </div>

                                        <p className="mt-2 text-lg font-bold text-gray-900">
                                            ₹{item.price}
                                        </p>

                                        {/* Quantity */}
                                        <div className="mt-4 flex items-center justify-between">

                                            <div className="flex items-center rounded-lg border border-gray-300">

                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(item._id)
                                                    }
                                                    className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-100"
                                                >
                                                    −
                                                </button>

                                                <span className="min-w-10 px-3 text-center font-medium">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(item._id)
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                        item.stock
                                                    }
                                                    className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <p className="font-semibold text-gray-800">
                                                ₹{item.price * item.quantity}
                                            </p>

                                        </div>

                                        <p className="mt-2 text-xs text-gray-400">
                                            {item.stock} available
                                        </p>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                    {/* Summary */}
                    <div>

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-bold text-gray-800">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-4">

                                <div className="flex justify-between text-gray-600">
                                    <span>
                                        Items ({cartCount})
                                    </span>

                                    <span>
                                        ₹{cartTotal}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>
                                        Delivery
                                    </span>

                                    <span>
                                        Calculated at checkout
                                    </span>
                                </div>

                                <div className="border-t pt-4">

                                    <div className="flex justify-between">

                                        <span className="text-lg font-bold text-gray-800">
                                            Total
                                        </span>

                                        <span className="text-xl font-bold text-gray-900">
                                            ₹{cartTotal}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            <Link
                                to="/checkout"
                                className="mt-6 block w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                to="/products"
                                className="mt-3 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                Continue Shopping
                            </Link>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Cart;

