import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, subtotal, total, clearCart } = useCart();
  const navigate = useNavigate();

  // ✅ Flag to prevent redirect after placing order
  const orderPlacedRef = useRef(false);

  /* ================= PROTECT ROUTE ================= */
  useEffect(() => {
    if (cart.length === 0 && !orderPlacedRef.current) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  /* ================= PLACE ORDER ================= */
  const placeOrder = () => {
    orderPlacedRef.current = true; // ✅ prevent redirect

    const order = {
      id: "PS" + Math.floor(100000 + Math.random() * 900000),
      items: cart,
      total,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("lastOrder", JSON.stringify(order));
    clearCart();
    navigate("/order-success");
  };

  if (cart.length === 0) return null;

  return (
    <div className="bg-[#fffaf6] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <p className="text-sm text-gray-500 mb-6">
          Home / Cart / <span className="text-gray-800 font-medium">Checkout</span>
        </p>

        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* DELIVERY ADDRESS */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
            <h2 className="font-semibold mb-6">Delivery Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input className="input" />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input className="input" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input className="input" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input className="input" />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium">Street Address</label>
              <input className="input" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium">City</label>
                <input className="input" />
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <input className="input" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">PIN Code</label>
              <input className="input" />
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={item.image} className="w-12 h-12 rounded object-cover" />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <hr className="mb-4" />

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>Delivery</span>
              <span className="text-orange-500 font-medium">FREE</span>
            </div>

            <div className="flex justify-between font-semibold mb-6">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={placeOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          margin-top: 6px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          outline: none;
        }
      `}</style>
    </div>
  );
}
