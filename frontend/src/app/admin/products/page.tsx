"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  sellerId: number;
  createdAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/admin/products");
      setProducts(response.data);
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
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
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
              📦 Manage Products
            </h1>
            <p className="text-gray-500 mt-1">
              {products.length} total products
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-green-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    Seller ID
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <span className="text-xl">📦</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-gray-400 text-xs line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
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

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${product.stock === 0 ? "text-red-500" : "text-gray-800"}`}
                      >
                        {product.stock}
                        {product.stock === 0 && (
                          <span className="text-red-400 text-xs ml-1">
                            (out)
                          </span>
                        )}
                      </span>
                    </td>

                    {/* Seller ID */}
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      #{product.sellerId}
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
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition disabled:opacity-50"
                        >
                          {deleting === product.id ? "..." : "🗑 Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <span className="text-6xl">📦</span>
              <p className="text-gray-400 text-xl mt-4">No products found!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
