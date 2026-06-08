"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [stockEdits, setStockEdits] = useState<Record<number, number>>({});
  const [updatingStock, setUpdatingStock] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "seller" && user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchMyProducts();
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      const response = await api.get("/products/my-products");
      setProducts(response.data);
      // Initialize stock edits
      const initialStocks: Record<number, number> = {};
      response.data.forEach((p: Product) => {
        initialStocks[p.id] = p.stock;
      });
      setStockEdits(initialStocks);
    } catch (err) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const handleStockUpdate = async (id: number) => {
    setUpdatingStock(id);
    try {
      await api.patch(`/products/${id}/stock`, {
        stock: stockEdits[id],
      });
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, stock: stockEdits[id] } : p,
        ),
      );
      alert("✅ Stock updated!");
    } catch (err) {
      alert("Failed to update stock");
    } finally {
      setUpdatingStock(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-600">
              🏪 Seller Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/seller/orders"
              className="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              📦 My Orders
            </Link>
            <Link
              href="/seller/products/new"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              + Add New Product
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-4xl font-bold text-green-600">
              {products.length}
            </p>
            <p className="text-gray-500 mt-1">Total Products</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-4xl font-bold text-green-600">
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </p>
            <p className="text-gray-500 mt-1">Total Stock</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-4xl font-bold text-red-500">
              {products.filter((p) => p.stock === 0).length}
            </p>
            <p className="text-gray-500 mt-1">Out of Stock</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">My Products</h2>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl">📦</span>
              <p className="text-gray-400 text-xl mt-4">No products yet!</p>
              <Link
                href="/seller/products/new"
                className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition inline-block"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                      Product
                    </th>
                    <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                      Price
                    </th>
                    <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                      Stock
                    </th>
                    <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      {/* Product Name */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-gray-400 text-sm line-clamp-1">
                          {product.description}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-semibold text-green-600">
                        {Number(product.price).toLocaleString()} ETB
                      </td>

                      {/* Stock — Quick Edit */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={stockEdits[product.id] ?? product.stock}
                            onChange={(e) =>
                              setStockEdits({
                                ...stockEdits,
                                [product.id]: Number(e.target.value),
                              })
                            }
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            onClick={() => handleStockUpdate(product.id)}
                            disabled={updatingStock === product.id}
                            className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 transition disabled:opacity-50"
                          >
                            {updatingStock === product.id ? "..." : "Update"}
                          </button>
                        </div>
                        {product.stock === 0 && (
                          <span className="text-red-500 text-xs mt-1 block">
                            Out of stock!
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/products/${product.id}`}
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 transition"
                          >
                            View
                          </Link>
                          <Link
                            href={`/seller/products/edit/${product.id}`}
                            className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-200 transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition disabled:opacity-50"
                          >
                            {deleting === product.id ? "..." : "Delete"}
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
    </div>
  );
}
