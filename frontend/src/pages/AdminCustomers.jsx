import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import API_URL from "../services/api";

function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${API_URL}/customers`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load customers");
                    return;
                }

                setCustomers(data.customers || []);
            } catch (error) {
                console.error(error);
                setError("Something went wrong while loading customers");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [token]);

    const filteredCustomers = customers.filter((customer) => {
        const searchText = search.toLowerCase();

        return (
            customer.name.toLowerCase().includes(searchText) ||
            customer.email.toLowerCase().includes(searchText)
        );
    });

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Customers
                    </h1>

                    <p className="mt-1 text-gray-500">
                        View your registered customers and their order activity.
                    </p>
                </div>

                {/* Search */}
                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-500">
                            Loading customers...
                        </p>
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <div className="text-5xl">👥</div>

                        <h2 className="mt-4 text-xl font-semibold text-gray-800">
                            {search
                                ? "No customers found"
                                : "No customers yet"}
                        </h2>

                        <p className="mt-2 text-gray-500">
                            {search
                                ? "Try a different name or email."
                                : "Registered customers will appear here."}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">

                            <div className="border-b p-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    All Customers
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {filteredCustomers.length} customer
                                    {filteredCustomers.length !== 1
                                        ? "s"
                                        : ""}
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-sm text-gray-500">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">
                                                Customer
                                            </th>

                                            <th className="px-6 py-4 font-medium">
                                                Joined
                                            </th>

                                            <th className="px-6 py-4 font-medium">
                                                Orders
                                            </th>

                                            <th className="px-6 py-4 font-medium">
                                                Total Spent
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y">
                                        {filteredCustomers.map((customer) => (
                                            <tr
                                                key={customer._id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                                            {customer.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-gray-800">
                                                                {customer.name}
                                                            </p>

                                                            <p className="text-sm text-gray-500">
                                                                {customer.email}
                                                            </p>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {new Date(
                                                        customer.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                                        {customer.totalOrders}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 font-semibold text-gray-800">
                                                    ₹{customer.totalSpent}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="space-y-4 md:hidden">

                            <div className="rounded-xl bg-white p-5 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    All Customers
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {filteredCustomers.length} customer
                                    {filteredCustomers.length !== 1
                                        ? "s"
                                        : ""}
                                </p>
                            </div>

                            {filteredCustomers.map((customer) => (
                                <div
                                    key={customer._id}
                                    className="rounded-xl bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                                            {customer.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-gray-800">
                                                {customer.name}
                                            </h3>

                                            <p className="truncate text-sm text-gray-500">
                                                {customer.email}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">

                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-xs text-gray-400">
                                                Orders
                                            </p>

                                            <p className="mt-1 font-semibold text-gray-800">
                                                {customer.totalOrders}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-xs text-gray-400">
                                                Total Spent
                                            </p>

                                            <p className="mt-1 font-semibold text-gray-800">
                                                ₹{customer.totalSpent}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-4 border-t pt-4">
                                        <p className="text-xs text-gray-400">
                                            Joined
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {new Date(
                                                customer.createdAt
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

                                </div>
                            ))}

                        </div>
                    </>
                )}

            </div>
        </AdminLayout>
    );
}

export default AdminCustomers;

