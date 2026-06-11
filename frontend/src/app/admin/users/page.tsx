"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [updatingRole, setUpdatingRole] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const handleRoleUpdate = async (id: number, role: string) => {
    setUpdatingRole(id);
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      alert("Failed to update role");
    } finally {
      setUpdatingRole(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "seller":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return "👑";
      case "seller":
        return "🏪";
      default:
        return "👤";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading users...</p>
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
              👥 Manage Users
            </h1>
            <p className="text-gray-500 mt-1">{users.length} total users</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-green-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                    User
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                    Joined
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {u.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(u.role)}`}
                      >
                        {getRoleIcon(u.role)} {u.role}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      {u.role !== "admin" && (
                        <div className="flex gap-2 flex-wrap">
                          {/* Role Toggle */}
                          {u.role === "customer" && (
                            <button
                              onClick={() => handleRoleUpdate(u.id, "seller")}
                              disabled={updatingRole === u.id}
                              className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-200 transition disabled:opacity-50"
                            >
                              {updatingRole === u.id ? "..." : "→ Make Seller"}
                            </button>
                          )}

                          {u.role === "seller" && (
                            <button
                              onClick={() => handleRoleUpdate(u.id, "customer")}
                              disabled={updatingRole === u.id}
                              className="bg-green-100 text-green-600 px-3 py-1 rounded text-xs hover:bg-green-200 transition disabled:opacity-50"
                            >
                              {updatingRole === u.id
                                ? "..."
                                : "→ Make Customer"}
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={deleting === u.id}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200 transition disabled:opacity-50"
                          >
                            {deleting === u.id ? "..." : "🗑 Delete"}
                          </button>
                        </div>
                      )}
                      {u.role === "admin" && (
                        <span className="text-gray-300 text-xs">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
