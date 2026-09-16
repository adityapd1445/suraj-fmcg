import { useEffect, useState } from "react";
import API_URL from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

function DailySales() {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [allSales, setAllSales] = useState([]);
    const [salesView, setSalesView] = useState("today");
    const [searchSales, setSearchSales] = useState("");
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalBills: 0,
        totalProductsSold: 0
    });

    const [loading, setLoading] = useState(true);
    const [creatingSale, setCreatingSale] = useState(false);

    const [customerName, setCustomerName] = useState(
        "Walk-in Customer"
    );

    const [paymentMethod, setPaymentMethod] = useState("cash");

    const [saleItems, setSaleItems] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // ==========================================
    // FETCH PRODUCTS
    // ==========================================
    const fetchProducts = async () => {
        try {
            const response = await fetch(
                `${API_URL}/products`
            );

            const data = await response.json();

            if (data.success) {
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    // ==========================================
    // FETCH TODAY'S SALES
    // ==========================================
    const fetchTodaySales = async () => {
        try {
            const response = await fetch(
                `${API_URL}/daily-sales/today`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to fetch today's sales."
                );
            }

            setSales(data.sales || []);
        } catch (error) {
            console.error(
                "Failed to fetch sales history:",
                error
            );
            setError(error.message);
        }
    };

    // ==========================================
    // LOAD PAGE DATA
    // ==========================================
    const loadData = async () => {
        setLoading(true);
        setError("");

        await Promise.all([
            fetchProducts(),
            fetchTodaySales(),
        ]);

        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);


    // ==========================================
    // ADD PRODUCT TO CURRENT BILL
    // ==========================================
    const addProductToSale = () => {
        setError("");
        setMessage("");

        if (!selectedProduct) {
            setError("Please select a product.");
            return;
        }

        const product = products.find(
            (item) => item._id === selectedProduct
        );

        if (!product) {
            setError("Product not found.");
            return;
        }

        const qty = Number(quantity);

        if (!Number.isInteger(qty) || qty <= 0) {
            setError(
                "Quantity must be a positive whole number."
            );
            return;
        }

        if (product.stock <= 0) {
            setError(
                `"${product.name}" is out of stock.`
            );
            return;
        }

        // Check if product already exists in current bill
        const existingItem = saleItems.find(
            (item) => item.product === product._id
        );

        const existingQuantity = existingItem
            ? existingItem.quantity
            : 0;

        if (
            existingQuantity + qty >
            product.stock
        ) {
            setError(
                `Only ${product.stock} units of "${product.name}" are available.`
            );
            return;
        }

        if (existingItem) {
            setSaleItems((currentItems) =>
                currentItems.map((item) =>
                    item.product === product._id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + qty,
                              total:
                                  (item.quantity + qty) *
                                  item.price
                          }
                        : item
                )
            );
        } else {
            setSaleItems((currentItems) => [
                ...currentItems,
                {
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: qty,
                    total: product.price * qty,
                    stock: product.stock,
                    image: product.image
                }
            ]);
        }

        setSelectedProduct("");
        setQuantity(1);
    };

    // ==========================================
    // CHANGE ITEM QUANTITY
    // ==========================================
    const updateQuantity = (productId, newQuantity) => {
        const product = products.find(
            (item) => item._id === productId
        );

        if (!product) return;

        let qty = Number(newQuantity);

        if (!Number.isInteger(qty) || qty < 1) {
            qty = 1;
        }

        if (qty > product.stock) {
            qty = product.stock;
        }

        setSaleItems((currentItems) =>
            currentItems.map((item) =>
                item.product === productId
                    ? {
                          ...item,
                          quantity: qty,
                          total: item.price * qty
                      }
                    : item
            )
        );
    };

    // ==========================================
    // REMOVE ITEM
    // ==========================================
    const removeItem = (productId) => {
        setSaleItems((currentItems) =>
            currentItems.filter(
                (item) => item.product !== productId
            )
        );
    };

    // ==========================================
    // CALCULATE CURRENT BILL TOTAL
    // ==========================================
    const billTotal = saleItems.reduce(
        (total, item) => total + item.total,
        0
    );

    // ==========================================
    // CREATE SALE
    // ==========================================
    const createSale = async () => {
        setError("");
        setMessage("");

        if (saleItems.length === 0) {
            setError(
                "Please add at least one product."
            );
            return;
        }

        try {
            setCreatingSale(true);

            const response = await fetch(
                `${API_URL}/daily-sales`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        customerName:
                            customerName.trim() ||
                            "Walk-in Customer",

                        paymentMethod,

                        items: saleItems.map((item) => ({
                            product: item.product,
                            quantity: item.quantity
                        }))
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create sale."
                );
            }

            setMessage(
                `Bill ${data.sale.billNumber} created successfully.`
            );
            setSelectedSale(data.sale);

            // Clear current bill
            setSaleItems([]);
            setSelectedProduct("");
            setQuantity(1);
            setCustomerName("Walk-in Customer");
            setPaymentMethod("cash");

            // Refresh products because stock changed
            await loadData();
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                    "Failed to create sale."
            );
        } finally {
            setCreatingSale(false);
        }
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================
    const formatDate = (date) => {
        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };
    // ==========================================
// FILTER SALES HISTORY
// ==========================================
const filteredSales = allSales.filter((sale) => {
    const search = searchSales
        .trim()
        .toLowerCase();

    // Search by bill number or customer name
    const matchesSearch =
        !search ||
        sale.billNumber
            ?.toLowerCase()
            .includes(search) ||
        sale.customerName
            ?.toLowerCase()
            .includes(search);

    const saleDate = new Date(sale.saleDate);
    const now = new Date();

    let matchesDate = true;

    if (salesView === "today") {
        matchesDate =
            saleDate.toDateString() ===
            now.toDateString();
    }

    if (salesView === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(
            yesterday.getDate() - 1
        );

        matchesDate =
            saleDate.toDateString() ===
            yesterday.toDateString();
    }

    return matchesSearch && matchesDate;
});

    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">

            {/* PAGE HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Daily Sales
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage physical shop sales, bills and
                    stock.
                </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {/* SUCCESS */}
            {message && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {message}
                </div>
            )}

            {/* TODAY'S SUMMARY */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">

                {/* TOTAL SALES */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-sm">
                    <p className="text-sm font-medium text-blue-100">
                        Today's Sales
                    </p>

                    <p className="mt-2 text-2xl font-bold sm:text-3xl">
                        &#8377;
                        {summary.totalSales.toLocaleString(
                            "en-IN"
                        )}
                    </p>
                </div>

                {/* TOTAL BILLS */}
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                    <p className="text-sm font-medium text-gray-500">
                        Bills Today
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                        {summary.totalBills}
                    </p>
                </div>

                {/* PRODUCTS SOLD */}
                <div className="col-span-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 lg:col-span-1">
                    <p className="text-sm font-medium text-gray-500">
                        Products Sold
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                        {summary.totalProductsSold}
                    </p>
                </div>
            </div>

            {/* NEW SALE */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">

                <div className="mb-5">
                    <h2 className="text-lg font-bold text-gray-900">
                        Create New Sale
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Add products sold from the physical
                        shop.
                    </p>
                </div>

                {/* CUSTOMER + PAYMENT */}
                <div className="grid gap-4 md:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) =>
                                setCustomerName(
                                    e.target.value
                                )
                            }
                            placeholder="Walk-in Customer"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Payment Method
                        </label>

                        <select
                            value={paymentMethod}
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="cash">
                                Cash
                            </option>

                            <option value="upi">
                                UPI
                            </option>

                            <option value="credit">
                                Credit
                            </option>
                        </select>
                    </div>
                </div>

                {/* ADD PRODUCT */}
                <div className="mt-5 rounded-xl bg-gray-50 p-4">

                    <div className="grid gap-3 md:grid-cols-[1fr_140px_auto]">

                        <select
                            value={selectedProduct}
                            onChange={(e) =>
                                setSelectedProduct(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                Select Product
                            </option>

                            {products.map((product) => (
                                <option
                                    key={product._id}
                                    value={product._id}
                                    disabled={
                                        product.stock <= 0
                                    }
                                >
                                    {product.name} — ₹
                                    {product.price} — Stock:{" "}
                                    {product.stock}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="button"
                            onClick={addProductToSale}
                            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            + Add Product
                        </button>
                    </div>
                </div>

                {/* CURRENT BILL */}
                {saleItems.length > 0 && (
                    <div className="mt-5">

                        <h3 className="mb-3 text-sm font-bold text-gray-800">
                            Current Bill
                        </h3>

                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="min-w-full text-sm">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                            Product
                                        </th>

                                        <th className="px-4 py-3 text-right font-semibold text-gray-600">
                                            Price
                                        </th>

                                        <th className="px-4 py-3 text-center font-semibold text-gray-600">
                                            Quantity
                                        </th>

                                        <th className="px-4 py-3 text-right font-semibold text-gray-600">
                                            Total
                                        </th>

                                        <th className="px-4 py-3 text-center font-semibold text-gray-600">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {saleItems.map(
                                        (item) => (
                                            <tr
                                                key={
                                                    item.product
                                                }
                                            >
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {
                                                        item.name
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    &#8377;
                                                    {item.price.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product,
                                                                    item.quantity -
                                                                        1
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                            className="h-8 w-8 rounded-lg bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            -
                                                        </button>

                                                        <span className="w-8 text-center font-semibold">
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product,
                                                                    item.quantity +
                                                                        1
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity >=
                                                                item.stock
                                                            }
                                                            className="h-8 w-8 rounded-lg bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3 text-right font-semibold">
                                                    &#8377;
                                                    {item.total.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(
                                                                item.product
                                                            )
                                                        }
                                                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* TOTAL + CREATE BILL */}
                        <div className="mt-5 flex flex-col items-stretch gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Bill Total
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    &#8377;
                                    {billTotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={createSale}
                                disabled={creatingSale}
                                className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {creatingSale
                                    ? "Creating Bill..."
                                    : "Create Bill"}
                            </button>
                        </div>
                    </div>
                )}

                {/* EMPTY BILL */}
                {saleItems.length === 0 && (
                    <div className="mt-5 rounded-xl border border-dashed border-gray-300 py-10 text-center">
                        <p className="text-sm font-medium text-gray-500">
                            No products added to the bill yet.
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            Select a product above to start a
                            new sale.
                        </p>
                    </div>
                )}
            </div>

            {/* TODAY'S SALES */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">

                <div className="mb-5">
                    <h2 className="text-lg font-bold text-gray-900">
                        Today's Bills
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Physical shop sales recorded today.
                    </p>
                </div>

                {sales.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
                        <p className="font-medium text-gray-500">
                            No sales recorded today.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sales.map((sale) => (
                            <div
                                key={sale._id}
                                className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {sale.billNumber}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {
                                                sale.customerName
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {formatDate(
                                                sale.saleDate
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-5 sm:justify-end">

                                        <div className="text-left sm:text-right">
                                            <p className="text-xs text-gray-400">
                                                {
                                                    sale.items
                                                        .length
                                                }{" "}
                                                product
                                                {sale.items
                                                    .length !==
                                                1
                                                    ? "s"
                                                    : ""}
                                            </p>

                                            <p className="font-bold text-gray-900">
                                                &#8377;
                                                {sale.totalAmount.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                                            {
                                                sale.paymentMethod
                                            }
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedSale(sale)}
                                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            View Bill
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        {/* BILL MODAL */}
{selectedSale && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">

        <style>
            {`
                @media print {
                    body * {
                        visibility: hidden !important;
                    }

                    .print-bill,
                    .print-bill * {
                        visibility: visible !important;
                    }

                    .print-bill {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }

                    .no-print {
                        display: none !important;
                    }
                }
            `}
        </style>

        <div className="print-bill max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* BILL HEADER */}
            <div className="border-b border-gray-200 px-6 py-6 text-center">

                <h2 className="text-2xl font-extrabold text-blue-700">
                    Suraj FMCG
                </h2>

                <p className="mt-1 text-xs font-semibold tracking-wide text-gray-500">
                    WHOLESALE • DISTRIBUTION • SUPPLY
                </p>

                <p className="mt-3 text-sm font-medium text-gray-500">
                    Physical Shop Sale
                </p>

            </div>

            {/* BILL DETAILS */}
            <div className="px-6 py-5">

                <div className="grid grid-cols-2 gap-3 text-sm">

                    <div>
                        <p className="text-xs text-gray-400">
                            Bill Number
                        </p>

                        <p className="font-bold text-gray-900">
                            {selectedSale.billNumber}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-400">
                            Date
                        </p>

                        <p className="font-medium text-gray-900">
                            {formatDate(
                                selectedSale.saleDate
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400">
                            Customer
                        </p>

                        <p className="font-medium text-gray-900">
                            {selectedSale.customerName}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-400">
                            Payment
                        </p>

                        <p className="font-semibold capitalize text-gray-900">
                            {selectedSale.paymentMethod}
                        </p>
                    </div>

                </div>

                {/* ITEMS */}
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left font-semibold text-gray-600">
                                    Product
                                </th>

                                <th className="px-3 py-3 text-center font-semibold text-gray-600">
                                    Qty
                                </th>

                                <th className="px-3 py-3 text-right font-semibold text-gray-600">
                                    Price
                                </th>

                                <th className="px-3 py-3 text-right font-semibold text-gray-600">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {selectedSale.items.map(
                                (item, index) => (
                                    <tr key={index}>

                                        <td className="px-3 py-3 font-medium text-gray-900">
                                            {item.name}
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                            {item.quantity}
                                        </td>

                                        <td className="px-3 py-3 text-right">
                                            &#8377;
                                            {item.price.toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>

                                        <td className="px-3 py-3 text-right font-semibold">
                                            &#8377;
                                            {item.total.toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                </div>

                {/* TOTAL */}
                <div className="mt-5 border-t border-gray-200 pt-4">

                    <div className="flex items-center justify-between">

                        <span className="text-lg font-semibold text-gray-700">
                            Total
                        </span>

                        <span className="text-2xl font-extrabold text-gray-900">
                            &#8377;
                            {selectedSale.totalAmount.toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>

                </div>

                {/* FOOTER */}
                <div className="mt-6 text-center">

                    <p className="text-sm font-medium text-gray-700">
                        Thank you for your business!
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Suraj FMCG
                    </p>

                </div>

                {/* BUTTONS */}
                <div className="no-print mt-6 flex gap-3">

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        🖨️ Print Bill
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setSelectedSale(null)
                        }
                        className="flex-1 rounded-xl bg-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
                    >
                        Close
                    </button>

                </div>

            </div>
        </div>
    </div>
)}
        </AdminLayout>
    );
}

export default DailySales;