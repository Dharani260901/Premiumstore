import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4">

      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="rounded-lg h-64 w-full object-cover cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      />

      {/* CATEGORY */}
      <p className="text-xs text-gray-400 mt-3">{product.category}</p>

      {/* TITLE */}
      <h3
        className="font-semibold text-sm mt-1 cursor-pointer hover:text-orange-500"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {product.name}
      </h3>

      {/* PRICE + CTA */}
      <div className="flex items-center justify-between mt-3">
        <span className="font-bold">₹{product.price}</span>

        <button
          onClick={() => addToCart(product)}
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded-full"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
