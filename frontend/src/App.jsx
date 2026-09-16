import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import ShopProducts from "./pages/ShopProducts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import DailySales from "./pages/admin/DailySales";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Customer pages */}
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/products"
                    element={<ShopProducts />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/register"
                    element={<Register />}
                />
                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

                {/* Logged-in customer pages */}
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />

                {/* Admin pages */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/products"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <Products />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/customers"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminCustomers />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/daily-sales"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <DailySales />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
