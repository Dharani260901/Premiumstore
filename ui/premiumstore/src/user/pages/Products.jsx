import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext.jsx";
import ProductCard from "../components/ProductCard";

const API = "http://localhost:5000/api/products";

export default function Products() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API)
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    active === "All"
      ? products
      : products.filter((p) => p.category === active.toLowerCase());

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">
            {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'}
          </p>
          <h1 className="text-5xl font-light tracking-tight mb-6">
            {active === "All" ? "All Collections" : `${active}'s Collection`}
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl">
            Discover our curated selection of premium fashion pieces designed for style and comfort
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-12 pb-8 border-b border-slate-100">
          <p className="text-xs tracking-wider uppercase text-gray-600 mb-4">Filter by Category</p>
          <div className="flex flex-wrap gap-3">
            {["All", "Men", "Women", "Girls", "Boys", "Shoes"].map((category) => (
              <button
                key={category}
                onClick={() => setActive(category)}
                className={`px-6 py-2.5 text-sm tracking-wide transition-all duration-300 ${
                  active === category
                    ? "bg-amber-700 text-white"
                    : "bg-slate-50 text-gray-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <EmptyState category={active} setActive={setActive} />
        )}
      </div>
    </div>
  );
}

/* ================= EMPTY STATE COMPONENT ================= */
function EmptyState({ category, setActive }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <h3 className="text-2xl font-light tracking-wide mb-3">No Products Found</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
        We couldn't find any products in the {category} category. Try browsing our other collections.
      </p>
      <button
        onClick={() => setActive("All")}
        className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 text-sm tracking-wide transition-colors duration-300"
      >
        View All Products
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </button>
    </div>
  );
}