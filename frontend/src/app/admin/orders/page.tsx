"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface OrderItem {
  id: number;
  quantity: number;
  priceAtPurchase: number;
  product: {
    name: string;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  fullName: string;
  phone: string;
  address: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/admin/orders");
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, status: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "shipped":
        return "🚚";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
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
              📋 Manage Orders
            </h1>
            <p className="text-gray-500 mt-1">{orders.length} total orders</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-green-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "pending", "shipped", "delivered", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition capitalize ${
                  filter === status
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:border-green-500"
                }`}
              >
                {status === "all"
                  ? "📋 All"
                  : `${getStatusIcon(status)} ${status}`}
              </button>
            ),
          )}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl">📋</span>
            <p className="text-gray-400 text-xl mt-4">No orders found!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Order #{order.id}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      👤 {order.fullName} | 📞 {order.phone}
                    </p>
                    <p className="text-gray-500 text-sm">📍 {order.address}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {Number(order.totalAmount).toLocaleString()} ETB
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2"
                    >
                      <p className="text-gray-700">
                        {item.product?.name || "Product"}
                        <span className="text-gray-400 text-sm ml-2">
                          x{item.quantity}
                        </span>
                      </p>
                      <p className="font-semibold text-gray-800">
                        {(
                          Number(item.priceAtPurchase) * item.quantity
                        ).toLocaleString()}{" "}
                        ETB
                      </p>
                    </div>
                  ))}
                </div>

                {/* Status Actions */}
                <div className="flex gap-3 flex-wrap">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(order.id, "shipped")}
                        disabled={updating === order.id}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {updating === order.id ? "..." : "🚚 Mark Shipped"}
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(order.id, "cancelled")
                        }
                        disabled={updating === order.id}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition disabled:opacity-50"
                      >
                        ❌ Cancel Order
                      </button>
                    </>
                  )}
                  {order.status === "shipped" && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, "delivered")}
                      disabled={updating === order.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {updating === order.id ? "..." : "✅ Mark Delivered"}
                    </button>
                  )}
                  {(order.status === "delivered" ||
                    order.status === "cancelled") && (
                    <span className="text-gray-400 text-sm py-2">
                      Order completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
