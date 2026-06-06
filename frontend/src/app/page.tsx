import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">🌿 Habesha Market</h1>
          <p className="text-xl text-green-100 mb-8">
            Discover authentic Ethiopian products — coffee, spices, traditional
            clothing and more!
          </p>
          <Link
            href="/products"
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition inline-block"
          >
            Browse Products →
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Habesha Market?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <span className="text-5xl">☕</span>
            <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">
              Premium Coffee
            </h3>
            <p className="text-gray-500">
              Authentic Ethiopian coffee from Yirgacheffe, Sidama and Harrar
              regions.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <span className="text-5xl">🌶️</span>
            <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">
              Traditional Spices
            </h3>
            <p className="text-gray-500">
              Berbere, Mitmita, Niter Kibbeh and more handcrafted Ethiopian
              spice blends.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <span className="text-5xl">👗</span>
            <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">
              Cultural Clothing
            </h3>
            <p className="text-gray-500">
              Beautiful Habesha Kemis and traditional garments for every
              occasion.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-50 py-16 px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to shop?
        </h2>
        <p className="text-gray-500 mb-8">
          Join thousands of customers enjoying authentic Ethiopian products.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            Create Account
          </Link>
          <Link
            href="/products"
            className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-8">
        <p>© 2026 Habesha Market. Built with ❤️ in Ethiopia.</p>
      </footer>
    </div>
  );
}
