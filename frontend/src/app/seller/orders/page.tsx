"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface OrderItem {
  id: number;
  product: { name: string; price: number };
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  id: number;
  buyer: { name: string; email: string };
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  phoneNumber: string;
  createdAt: string;
}

export default function SellerOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!user || (user.role !== "seller" && user.role !== "admin")) {
      router.push("/");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/seller");
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as any } : o,
        ),
      );
      alert("✅ Order status updated!");
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600">📦 My Orders</h1>
          <p className="text-gray-500 mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center bg-white rounded-lg p-12">
            <p className="text-gray-400 text-xl">No orders yet!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Order Header */}
                <div
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id,
                    )
                  }
                  className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold">Order #{order.id}</h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mt-1">
                      👤 {order.buyer.name} ({order.buyer.email})
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {Number(order.totalPrice).toLocaleString()} ETB
                    </p>
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {expandedOrder === order.id && (
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    {/* Items */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Items:
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between bg-white p-3 rounded"
                          >
                            <span>
                              {item.product.name} x{item.quantity}
                            </span>
                            <span className="font-semibold">
                              {(
                                Number(item.priceAtPurchase) * item.quantity
                              ).toLocaleString()}{" "}
                              ETB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Shipping Info:
                      </h4>
                      <p className="text-gray-600">
                        📍 {order.shippingAddress}
                      </p>
                      <p className="text-gray-600">📱 {order.phoneNumber}</p>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Update Status:
                      </h4>
                      <div className="flex gap-2">
                        {["pending", "shipped", "delivered", "cancelled"].map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() =>
                                handleStatusUpdate(order.id, status)
                              }
                              disabled={updatingStatus === order.id}
                              className={`px-4 py-2 rounded font-semibold transition ${
                                order.status === status
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              } disabled:opacity-50`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
