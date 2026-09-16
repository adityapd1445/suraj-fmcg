import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed");
                return;
            }

            // Registration successful
            navigate("/login");

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8">

            <div className="w-full max-w-md">

                {/* Brand */}
                <div className="mb-8 text-center">

                    <Link
                        to="/"
                        className="inline-block"
                    >
                        <h1 className="text-3xl font-extrabold tracking-tight text-blue-600 sm:text-4xl">
                            Suraj FMCG
                        </h1>

                        <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-gray-500 sm:text-xs">
                            WHOLESALE • DISTRIBUTION • SUPPLY
                        </p>
                    </Link>

                    <p className="mt-5 text-gray-500">
                        Create your customer account
                    </p>

                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">

                    {/* Header */}
                    <div className="text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                            👤
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-gray-800">
                            Create Account
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Register with Suraj FMCG to place orders.
                        </p>

                    </div>

                    <form
                        onSubmit={handleRegister}
                        className="mt-6 space-y-5"
                    >

                        {/* Name */}
                        <div>

                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your name"
                                autoComplete="name"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            />

                        </div>

                        {/* Email */}
                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            />

                        </div>

                        {/* Password */}
                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="At least 6 characters"
                                autoComplete="new-password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            />

                        </div>

                        {/* Confirm Password */}
                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter password again"
                                autoComplete="new-password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            />

                        </div>

                        {/* Error */}
                        {message && (
                            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {message}
                            </div>
                        )}

                        {/* Register */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account"}
                        </button>

                    </form>

                    {/* Login link */}
                    <div className="mt-6 border-t pt-6 text-center">

                        <p className="text-sm text-gray-500">
                            Already have an account?
                        </p>

                        <Link
                            to="/login"
                            className="mt-1 inline-block font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Login here
                        </Link>

                        <div className="mt-5">

                            <Link
                                to="/"
                                className="text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                ← Back to Suraj FMCG
                            </Link>

                        </div>

                    </div>

                </div>

                {/* Footer */}
                <div className="mt-6 text-center">

                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Suraj FMCG. All rights reserved.
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                        Wholesale • Distribution • Supply
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;