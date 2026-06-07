"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders. Please login first.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link
            href="/login"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">📋 My Orders</h1>
          <Link
            href="/products"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl">📦</span>
            <p className="text-gray-400 text-xl mt-4">No orders yet!</p>
            <Link
              href="/products"
              className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
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
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-100 pt-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.product.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          x{item.quantity} ×{" "}
                          {Number(item.priceAtPurchase).toLocaleString()} ETB
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {(
                          Number(item.priceAtPurchase) * item.quantity
                        ).toLocaleString()}{" "}
                        ETB
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center">
                  <div className="text-gray-500 text-sm">
                    <p>📍 {order.address}</p>
                    <p>📞 {order.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Total</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Number(order.totalAmount).toLocaleString()} ETB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
