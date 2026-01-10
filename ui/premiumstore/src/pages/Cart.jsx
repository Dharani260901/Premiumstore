import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeItem,
    subtotal,
    deliveryFee,
    total,
  } = useCart();

  /* ================= EMPTY CART UI ================= */
  if (cart.length === 0) {
    return (
      <div className="bg-[#fffaf6] min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          👜
        </div>

        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven't added any items yet
        </p>

        <Link
          to="/products"
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl shadow"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  /* ================= CART WITH ITEMS ================= */
  return (
    <div className="bg-[#fffaf6] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">
          Shopping Cart ({cart.length} item{cart.length > 1 ? "s" : ""})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ================= LEFT: CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between"
              >
                {/* LEFT */}
                <div className="flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div>
                    <h3 className="font-medium">{item.name}</h3>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                      >
                        −
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6">
                  <span className="font-semibold">
                    ₹{item.price * item.qty}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= RIGHT: ORDER SUMMARY ================= */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Delivery</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-orange-500 font-medium">FREE</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>

            {deliveryFee > 0 && (
              <p className="text-xs text-gray-400 mb-4">
                Add ₹{1000 - subtotal} more for free shipping
              </p>
            )}

            <hr className="my-4" />

            <div className="flex justify-between font-semibold mb-6">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium text-center mb-3"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="block text-center text-sm text-orange-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
