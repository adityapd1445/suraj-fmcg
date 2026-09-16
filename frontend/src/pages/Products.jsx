import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: ""
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Fetch products
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

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle text input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setMessage("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5 MB.");
            return;
        }

        setSelectedImage(file);
        setMessage("");
    };

    // Upload image to Cloudinary
    const uploadImage = async () => {
        if (!selectedImage) {
            return formData.image;
        }

        const token = localStorage.getItem("token");

        const imageData = new FormData();
        imageData.append("image", selectedImage);

        setUploadingImage(true);

        try {
            const response = await fetch(
                `${API_URL}/uploads/product-image`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: imageData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to upload image"
                );
            }

            return data.imageUrl;
        } finally {
            setUploadingImage(false);
        }
    };

    // Add or update product
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const token = localStorage.getItem("token");

        try {
            let imageUrl = formData.image;

            // Upload selected image first
            if (selectedImage) {
                imageUrl = await uploadImage();
            }

            const productData = {
                ...formData,
                image: imageUrl,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            let response;

            if (editingId) {
                // Update existing product
                response = await fetch(
                    `${API_URL}/products/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(productData)
                    }
                );
            } else {
                // Create new product
                response = await fetch(`${API_URL}/products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(productData)
                });
            }

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Something went wrong");
                return;
            }

            if (editingId) {
                setMessage("Product updated successfully!");
            } else {
                setMessage("Product added successfully!");
            }

            resetForm();
            fetchProducts();

        } catch (error) {
            console.error(error);
            setMessage(
                error.message || "Something went wrong"
            );
        }
    };

    // Start editing
    const handleEdit = (product) => {
        setEditingId(product._id);

        setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: product.image || ""
        });

        setSelectedImage(null);
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete product
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `${API_URL}/products/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to delete product"
                );
                return;
            }

            setMessage("Product deleted successfully!");

            fetchProducts();

        } catch (error) {
            console.error(error);
            setMessage("Something went wrong");
        }
    };

    // Reset form
    const resetForm = () => {
        setEditingId(null);

        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            image: ""
        });

        setSelectedImage(null);

        const fileInput = document.getElementById(
            "product-image"
        );

        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Products
                </h1>

                <p className="mt-1 text-gray-500">
                    Manage your shop products, prices and stock.
                </p>
            </div>

            {/* Add / Edit Form */}
            <div className="rounded-xl bg-white p-6 shadow">

                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-gray-800">
                        {editingId
                            ? "Edit Product"
                            : "Add New Product"}
                    </h2>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                        >
                            Cancel Edit
                        </button>
                    )}

                </div>

                {message && (
                    <div className="mb-5 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                        {message}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >

                    {/* Product Name */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Fortune Mustard Oil"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Grocery"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Price (&#8377;)
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="150"
                            min="0"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Stock Quantity
                        </label>

                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="25"
                            min="0"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="product-image"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Product Image
                        </label>

                        <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2.5 file:font-medium file:text-white hover:file:bg-blue-700"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                            JPG, PNG, WEBP or other image files. Maximum
                            size: 5 MB.
                        </p>

                        {selectedImage && (
                            <div className="mt-4 flex items-center gap-4 rounded-lg bg-gray-50 p-3">
                                <img
                                    src={URL.createObjectURL(
                                        selectedImage
                                    )}
                                    alt="Selected product"
                                    className="h-20 w-20 rounded-lg object-cover"
                                />

                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800">
                                        {selectedImage.name}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {(
                                            selectedImage.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </div>
                            </div>
                        )}

                        {editingId && formData.image && !selectedImage && (
                            <div className="mt-4">
                                <p className="mb-2 text-xs font-medium text-gray-500">
                                    Current Image
                                </p>

                                <img
                                    src={formData.image}
                                    alt="Current product"
                                    className="h-24 w-24 rounded-lg object-cover"
                                />

                                <p className="mt-2 text-xs text-gray-400">
                                    Choose a new image above if you want
                                    to replace it.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description..."
                            rows="4"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">

                        <button
                            type="submit"
                            disabled={uploadingImage}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {uploadingImage
                                ? "Uploading Image..."
                                : editingId
                                ? "Update Product"
                                : "Add Product"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>
            </div>

            {/* Product List */}
            <div className="rounded-xl bg-white p-6 shadow">

                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-gray-800">
                        All Products
                    </h2>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {products.length} Products
                    </span>

                </div>

                {loading ? (
                    <p className="text-gray-500">
                        Loading products...
                    </p>
                ) : products.length === 0 ? (
                    <p className="text-gray-500">
                        No products found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>
                                <tr className="border-b text-sm text-gray-500">
                                    <th className="px-4 py-3">
                                        Product
                                    </th>

                                    <th className="px-4 py-3">
                                        Category
                                    </th>

                                    <th className="px-4 py-3">
                                        Price
                                    </th>

                                    <th className="px-4 py-3">
                                        Stock
                                    </th>

                                    <th className="px-4 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="border-b last:border-0"
                                    >

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">

                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                                        No Image
                                                    </div>
                                                )}

                                                <span className="font-medium text-gray-800">
                                                    {product.name}
                                                </span>

                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-gray-600">
                                            {product.category}
                                        </td>

                                        <td className="px-4 py-4 font-medium text-gray-800">
                                            &#8377;{product.price}
                                        </td>

                                        <td className="px-4 py-4">

                                            <span
                                                className={
                                                    product.stock === 0
                                                        ? "font-medium text-red-600"
                                                        : product.stock <= 5
                                                        ? "font-medium text-orange-600"
                                                        : "font-medium text-green-600"
                                                }
                                            >
                                                {product.stock}
                                            </span>

                                        </td>

                                        <td className="px-4 py-4">

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(product)
                                                    }
                                                    className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(product._id)
                                                    }
                                                    className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Products;



