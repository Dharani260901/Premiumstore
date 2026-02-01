import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, setBuyNowItem } = useCart();
  const { user } = useAuth();

  const [isAdded, setIsAdded] = useState(false);

  // ✅ SAFE PRODUCT ID
  const productId = product?._id || product?.id;

  /* ================= PRODUCT PAGE ================= */
  const goToProduct = () => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (e) => {
    e.stopPropagation();

    // 🔐 LOGIN CHECK
    if (!user?.token) {
      navigate("/login", {
        state: { from: "/products" },
      });
      return;
    }

    addToCart(product);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = (e) => {
    e.stopPropagation();

    // 🔐 LOGIN CHECK (WITH RESUME)
    if (!user?.token) {
      navigate("/login", {
        state: {
          from: "/products",
          buyNow: true,
          product: {
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.image,
          },
        },
      });
      return;
    }

    // ✅ SET BUY NOW ITEM (NO CART POLLUTION)
    setBuyNowItem({
      productId: productId,
      name: product.name,
      price: product.price,
      qty: 1,
      image: product.image,
    });

    navigate("/checkout?mode=buynow");
  };

  return (
    <div className="group bg-white border border-slate-100 hover:border-slate-200 transition-all duration-300">
      
      {/* IMAGE */}
      <div
        className="relative overflow-hidden bg-slate-50 cursor-pointer"
        onClick={goToProduct}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* QUICK VIEW */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToProduct();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 px-6 py-2 text-sm tracking-wide"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-6">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">
          {product.category}
        </p>

        <h3
          onClick={goToProduct}
          className="font-light text-lg tracking-wide mb-3 cursor-pointer hover:text-amber-700 transition-colors line-clamp-2 min-h-[3.5rem]"
        >
          {product.name}
        </h3>

        <p className="text-xl font-light tracking-wide mb-5">
          ₹{product.price}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 text-sm tracking-wide transition-all duration-300 ${
              isAdded
                ? "bg-green-600 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {isAdded ? "Added" : "Add to Cart"}
          </button>

          {/* BUY NOW */}
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 text-sm tracking-wide bg-amber-700 hover:bg-amber-800 text-white transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
