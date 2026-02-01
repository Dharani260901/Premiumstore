import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext";

const API = "http://localhost:5000/api/products";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setBuyNowItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  /* 🔁 LOAD PRODUCT */
  useEffect(() => {
    axios
      .get(`${API}/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => navigate("/products"));
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = () => {
    // 🔐 LOGIN CHECK
    if (!user?.token) {
      navigate("/login", {
        state: {
          from: `/product/${id}`,
          buyNow: true,
        },
      });
      return;
    }

    // ✅ SET BUY NOW ITEM (RESPECT QTY)
    setBuyNowItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      qty: qty,
      image: product.image,
    });

    navigate("/checkout?mode=buynow");
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs tracking-wider uppercase text-gray-400 mb-12">
          <span
            className="hover:text-gray-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span
            className="hover:text-gray-600 cursor-pointer"
            onClick={() => navigate("/products")}
          >
            {product.category}
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="bg-slate-50 border border-slate-100 p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[600px] object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category Tag */}
            <div className="mb-4">
              <span className="inline-block text-xs tracking-[0.2em] uppercase text-gray-400 bg-slate-50 px-3 py-1.5 border border-slate-100">
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-light tracking-tight mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-8">
              <p className="text-3xl font-light tracking-wide">
                ₹{product.price}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-xs tracking-wider uppercase text-gray-600 mb-3">
                Quantity
              </label>
              <div className="flex items-center border border-slate-200 w-fit">
                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-gray-600 disabled:opacity-30"
                  disabled={qty <= 1}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <span className="w-16 text-center text-sm border-x border-slate-200">
                  {qty}
                </span>

                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-sm tracking-wide transition-all duration-300 mb-4 ${
                addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-amber-700 hover:bg-amber-800 text-white"
              }`}
            >
              {addedToCart ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Added to Cart
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* BUY NOW BUTTON */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 text-sm tracking-wide bg-slate-900 hover:bg-slate-800 text-white transition-colors duration-300 mb-4"
            >
              Buy Now
            </button>

            {/* View Cart Link */}
            <button
              onClick={() => navigate("/cart")}
              className="w-full border border-slate-200 hover:border-slate-300 bg-white text-gray-700 py-4 text-sm tracking-wide transition-colors duration-300 mb-8"
            >
              View Cart
            </button>

            {/* Product Features */}
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <h3 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">
                Product Features
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <Feature
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  }
                  title="Complimentary Shipping"
                  desc="Free delivery on orders above ₹999"
                />

                <Feature
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  }
                  title="Easy Returns"
                  desc="30-day hassle-free return policy"
                />

                <Feature
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  }
                  title="Secure Checkout"
                  desc="100% secure payment processing"
                />

                <Feature
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  }
                  title="Fast Delivery"
                  desc="Express shipping available"
                />
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  />
                </svg>
                <span>Authentic products guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= FEATURE COMPONENT ================= */
function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-amber-700">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium tracking-wide mb-0.5">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
