"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Failed to load stats");
    } finally {
      setLoading(false);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            👑 Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name}! Here's your platform overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-green-500">
            <p className="text-5xl font-bold text-green-600">
              {stats?.totalUsers}
            </p>
            <p className="text-gray-500 mt-2 font-medium">Total Users</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-blue-500">
            <p className="text-5xl font-bold text-blue-600">
              {stats?.totalProducts}
            </p>
            <p className="text-gray-500 mt-2 font-medium">Total Products</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-purple-500">
            <p className="text-5xl font-bold text-purple-600">
              {stats?.totalOrders}
            </p>
            <p className="text-gray-500 mt-2 font-medium">Total Orders</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-yellow-500">
            <p className="text-5xl font-bold text-yellow-600">
              {stats?.pendingOrders}
            </p>
            <p className="text-gray-500 mt-2 font-medium">Pending Orders</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-red-500 md:col-span-2">
            <p className="text-5xl font-bold text-red-600">
              {stats?.totalRevenue.toLocaleString()} ETB
            </p>
            <p className="text-gray-500 mt-2 font-medium">Total Revenue</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center group"
          >
            <span className="text-5xl">👥</span>
            <h3 className="text-xl font-bold text-gray-800 mt-4 group-hover:text-green-600 transition">
              Manage Users
            </h3>
            <p className="text-gray-400 mt-2">View, edit and delete users</p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center group"
          >
            <span className="text-5xl">📦</span>
            <h3 className="text-xl font-bold text-gray-800 mt-4 group-hover:text-green-600 transition">
              Manage Products
            </h3>
            <p className="text-gray-400 mt-2">View and remove products</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center group"
          >
            <span className="text-5xl">📋</span>
            <h3 className="text-xl font-bold text-gray-800 mt-4 group-hover:text-green-600 transition">
              Manage Orders
            </h3>
            <p className="text-gray-400 mt-2">View all platform orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
