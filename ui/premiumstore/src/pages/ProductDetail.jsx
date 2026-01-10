import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = PRODUCTS.find((p) => p.id === Number(id));

  const [qty, setQty] = useState(1);

  /* ================= PRODUCT NOT FOUND ================= */
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 text-orange-500"
          >
            Browse products
          </button>
        </div>
        <Footer />
      </>
    );
  }

  /* ================= ADD TO CART HANDLER ================= */
  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="bg-[#fffaf6] min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* ================= PRODUCT DETAIL ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-sm text-gray-500 mb-6">
          Home / {product.category} /{" "}
          <span className="text-gray-800 font-medium">
            {product.name}
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* IMAGE */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[480px] object-contain"
            />
          </div>

          {/* INFO */}
          <div>
            <p className="text-xs text-orange-500 font-semibold mb-2">
              {product.category}
            </p>

            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

            {/* PRICE */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="line-through text-gray-400">
                ₹{(product.price * 1.3).toFixed(0)}
              </span>
              <span className="text-orange-500 text-sm bg-orange-100 px-2 py-1 rounded-full">
                30% OFF
              </span>
            </div>

            <p className="text-gray-600 mb-6">
              Premium quality product designed for comfort and style.
              Perfect for everyday wear.
            </p>

            {/* QUANTITY */}
            <div className="mb-8">
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="w-9 h-9 bg-gray-100 rounded-lg"
                >
                  −
                </button>

                <span>{qty}</span>

                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 bg-gray-100 rounded-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              🛒 Add to Cart
            </button>

            {/* EXTRA INFO */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mt-8">
              <p>🚚 Free Shipping</p>
              <p>🔄 Easy Returns</p>
              <p>🔒 Secure Checkout</p>
              <p>⚡ Fast Delivery</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
