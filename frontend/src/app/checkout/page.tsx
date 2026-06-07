"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");
        setCartItems(response.data.items || []);
      } catch (err) {
        console.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);

    try {
      const response = await api.post("/orders", formData);
      alert(`✅ Order #${response.data.id} placed successfully!`);
      router.push("/orders");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl">Your cart is empty!</p>
          <Link
            href="/products"
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-green-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-gray-400 text-sm">x{item.quantity}</p>
                </div>
                <p className="font-bold text-green-600">
                  {(
                    Number(item.product.price) * item.quantity
                  ).toLocaleString()}{" "}
                  ETB
                </p>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-green-600">
                {totalPrice.toLocaleString()} ETB
              </span>
            </div>
          </div>

          {/* Delivery Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Delivery Information
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0911234567"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Addis Ababa, Bole"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
              >
                {placing ? "Placing Order..." : "✅ Place Order"}
              </button>

              <Link
                href="/cart"
                className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition block text-center"
              >
                ← Back to Cart
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
