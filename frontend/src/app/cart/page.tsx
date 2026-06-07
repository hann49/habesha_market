"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  };
}

interface Cart {
  id: number;
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (err) {
      console.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId: number) => {
    try {
      await api.delete(`/cart/item/${itemId}`);
      fetchCart();
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await api.patch(`/cart/item/${itemId}`, { quantity });
      fetchCart();
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    try {
      await api.delete("/cart");
      fetchCart();
    } catch (err) {
      alert("Failed to clear cart");
    }
  };

  const totalPrice =
    cart?.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    ) || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-8">🛒 My Cart</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl">🛒</span>
            <p className="text-gray-400 text-xl mt-4">Your cart is empty!</p>
            <Link
              href="/products"
              className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition inline-block"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-6 border-b border-gray-100 last:border-0"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-3xl">🛒</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-green-600 font-bold">
                      {item.product.price} ETB
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="font-bold text-gray-800 w-24 text-right">
                    {(
                      Number(item.product.price) * item.quantity
                    ).toLocaleString()}{" "}
                    ETB
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">
                  Items ({cart.items.length})
                </span>
                <span className="font-semibold">
                  {totalPrice.toLocaleString()} ETB
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>

              <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-2">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-green-600">
                  {totalPrice.toLocaleString()} ETB
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition block text-center"
              >
                Proceed to Checkout →
              </Link>

              <button
                onClick={handleClearCart}
                className="w-full mt-3 border border-red-400 text-red-400 py-2 rounded-lg hover:bg-red-50 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
