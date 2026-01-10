import { useState } from "react";
import { PRODUCTS } from "../data/products.js";
import { useCart } from "../context/CartContext";

const FILTERS = ["All", "Men", "Women", "Girls", "Boys"];

export default function Products() {
  const { addToCart } = useCart();
  const [active, setActive] = useState("Men");

  const filteredProducts =
    active === "All"
      ? PRODUCTS
      : PRODUCTS.filter(
          (p) => p.category.toLowerCase() === active.toLowerCase()
        );

  return (
    <div className="bg-[#fffaf6] min-h-screen">

      {/* ================= PAGE HEADER ================= */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <h1 className="text-2xl font-bold">Men's Collection</h1>
        <p className="text-sm text-gray-500 mt-1">
          {filteredProducts.length} products found
        </p>

        {/* FILTER BUTTONS */}
        <div className="flex gap-3 mt-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-full text-sm transition
                ${
                  active === f
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition"
          >
            {/* IMAGE */}
            <div className="p-6">
              <img
                src={product.image}
                alt={product.name}
                className="h-64 w-full object-contain"
              />
            </div>

            {/* DETAILS */}
            <div className="px-6 pb-6">
              <p className="text-xs text-gray-400 uppercase mb-1">
                {product.category}
              </p>

              <h3 className="font-semibold text-sm mb-3">
                {product.name}
              </h3>

              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">
                  ₹{product.price.toLocaleString()}
                </span>

                <button
                  onClick={() => addToCart(product)}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
