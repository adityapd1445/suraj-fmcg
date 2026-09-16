import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect based on account type
            if (data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

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
                        Welcome back! Please login to continue.
                    </p>

                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">

                    <div className="mb-6 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                            🔐
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-gray-800">
                            Welcome Back
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Login to your Suraj FMCG account.
                        </p>

                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

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

                            <div className="relative">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>

                        {/* Error / Message */}
                        {message && (
                            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {message}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                    {/* Register */}
                    <div className="mt-6 border-t pt-6 text-center">

                        <p className="text-sm text-gray-500">
                            Don't have an account?
                        </p>

                        <Link
                            to="/register"
                            className="mt-1 inline-block font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Create a customer account
                        </Link>

                        <div className="mt-5">

                            <Link
                                to="/"
                                className="text-sm font-medium text-gray-500 transition hover:text-gray-700"
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

export default Login;