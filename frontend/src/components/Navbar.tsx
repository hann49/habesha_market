"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-green-600">
          🌿 Habesha Market
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-gray-600 hover:text-green-600 font-medium transition"
          >
            Products
          </Link>

          {user ? (
            <>
              <Link
                href="/cart"
                className="text-gray-600 hover:text-green-600 font-medium transition"
              >
                🛒 Cart
              </Link>
              <Link
                href="/orders"
                className="text-gray-600 hover:text-green-600 font-medium transition"
              >
                Orders
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">Hi, {user.name}!</span>
                {(user.role === "seller" || user.role === "admin") && (
                  <Link
                    href="/seller/dashboard"
                    className="text-gray-600 hover:text-green-600 font-medium transition"
                  >
                    🏪 Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-green-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
