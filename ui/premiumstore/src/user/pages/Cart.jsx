import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

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
      <div className="bg-white min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>

        <h2 className="text-3xl font-light tracking-wide mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-sm">
          Begin your shopping journey and discover our curated collections
        </p>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-10 py-4 transition-colors duration-300 text-sm tracking-wide"
        >
          Explore Collections
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>
      </div>
    );
  }

  /* ================= CART WITH ITEMS ================= */
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">Shopping Bag</p>
          <h1 className="text-4xl font-light tracking-tight">
            {cart.length} {cart.length === 1 ? "Item" : "Items"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const id = item._id || item.id;

              return (
                <div
                  key={id}
                  className="bg-white border border-slate-100 p-6 transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-28 object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-light text-lg tracking-wide mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">Size: M • Color: Default</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <span className="text-xs tracking-wider uppercase text-gray-500">Quantity</span>
                        <div className="flex items-center border border-slate-200">
                          <button
                            onClick={() => decreaseQty(id)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors text-gray-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
                            </svg>
                          </button>

                          <span className="w-12 text-center text-sm">{item.qty}</span>

                          <button
                            onClick={() => increaseQty(id)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors text-gray-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>

                      <div className="text-right">
                        <p className="font-light text-lg tracking-wide">₹{item.price * item.qty}</p>
                        {item.qty > 1 && (
                          <p className="text-xs text-gray-400 mt-1">₹{item.price} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-8 sticky top-6">
              <h2 className="text-sm tracking-[0.2em] uppercase text-gray-600 mb-6">Order Summary</h2>

              {/* Subtotal */}
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-light">₹{subtotal}</span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Delivery</span>
                <span className="font-light">
                  {deliveryFee === 0 ? (
                    <span className="text-amber-700">Complimentary</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              {/* Free Shipping Progress */}
              {deliveryFee > 0 && (
                <div className="mt-4 mb-6">
                  <div className="bg-white h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-700 h-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Add ₹{1000 - subtotal} more for complimentary delivery
                  </p>
                </div>
              )}

              <div className="border-t border-slate-200 my-6"></div>

              {/* Total */}
              <div className="flex justify-between mb-8">
                <span className="text-sm tracking-wider uppercase text-gray-600">Total</span>
                <span className="text-2xl font-light tracking-wide">₹{total}</span>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full bg-amber-700 hover:bg-amber-800 text-white py-4 text-center text-sm tracking-wide transition-colors duration-300 mb-4"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block text-center text-sm text-gray-600 hover:text-amber-700 transition-colors tracking-wide"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                  </svg>
                  <span>Free returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}