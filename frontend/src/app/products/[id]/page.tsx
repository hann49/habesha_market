"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${params.id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await api.post("/cart/add", {
        productId: product?.id,
        quantity,
      });
      alert(`✅ Added ${quantity} x ${product?.name} to cart!`);
    } catch (err) {
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link href="/products" className="text-green-600 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/products"
          className="text-green-600 hover:underline mb-6 inline-block"
        >
          ← Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-green-50 flex items-center justify-center">
                  <span className="text-8xl">🛒</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              {/* Category */}
              {product.category && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  {product.category}
                </span>
              )}

              {/* Name */}
              <h1 className="text-2xl font-bold text-gray-800 mt-3">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-3xl font-bold text-green-600 mt-4">
                {product.price} ETB
              </p>

              {/* Stock */}
              <p
                className={`text-sm mt-2 ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {product.stock > 0
                  ? `✅ ${product.stock} items in stock`
                  : "❌ Out of stock"}
              </p>

              {/* Description */}
              {product.description && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-500 mt-1">{product.description}</p>
                </div>
              )}

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                disabled={product.stock === 0 || addingToCart}
                onClick={handleAddToCart}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart
                  ? "Adding..."
                  : product.stock > 0
                    ? "🛒 Add to Cart"
                    : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
