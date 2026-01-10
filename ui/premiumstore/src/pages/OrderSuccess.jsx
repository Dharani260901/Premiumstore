import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem("lastOrder"));

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="bg-[#fffaf6] min-h-screen flex flex-col items-center justify-center text-center px-4">

      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-orange-500 text-2xl">✔</span>
      </div>

      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for shopping with PremiumStore
      </p>

      <div className="bg-white rounded-xl shadow-sm px-8 py-6 w-full max-w-sm mb-8">
        <p className="text-sm text-gray-500 mb-1">Order Number</p>
        <p className="font-semibold text-lg mb-6">{order.id}</p>

        <div className="flex items-start gap-3 mb-4 text-left">
          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
            ✉
          </div>
          <div>
            <p className="text-sm font-medium">Confirmation Email</p>
            <p className="text-xs text-gray-500">
              We've sent order details to your email
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-left">
          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
            📦
          </div>
          <div>
            <p className="text-sm font-medium">Delivery Updates</p>
            <p className="text-xs text-gray-500">
              Track your order via email & SMS
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/products"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl shadow"
        >
          Continue Shopping
        </Link>

        <Link
          to="/"
          className="border border-gray-300 px-6 py-3 rounded-xl text-gray-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
