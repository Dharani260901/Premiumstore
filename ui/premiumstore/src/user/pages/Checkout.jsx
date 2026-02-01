import { useState, useEffect, useRef } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { mockOnlinePayment } from "../../utils/mockPayment.js";

const API = "http://localhost:5000/api";

export default function Checkout() {
  const { cart, clearCart, buyNowItem, setBuyNowItem } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const orderPlacedRef = useRef(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentMode, setPaymentMode] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
const params = new URLSearchParams(location.search);
const isBuyNow = params.get("mode") === "buynow";


const checkoutItems = isBuyNow
  ? buyNowItem
    ? [buyNowItem]   // 👈 IMPORTANT: array
    : []
  : cart;


  useEffect(() => {
    if (!user?.token) return;

    axios
      .get(`${API}/users/addresses`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setAddresses(res.data);
        const def = res.data.find((a) => a.isDefault);
        setSelectedAddress(def || null);
      })
      .catch(console.error);
  }, [user?.token]);

  /* ================= PROTECT ROUTE ================= */
  useEffect(() => {
  if (orderPlacedRef.current) return; // 🔥 STOP after order placed

    // 🔧 BUY NOW FIX: protect based on checkoutItems, not cart
  if (checkoutItems.length === 0) {
    navigate("/cart");
  }
}, [checkoutItems, navigate]);


  /* ================= PLACE ORDER ================= */
  /* ================= PLACE ORDER ================= */
const placeOrder = async () => {
  if (!selectedAddress) {
    alert("Please select a delivery address");
    return;
  }

  try {
    setLoading(true);
    orderPlacedRef.current = true;

    let paymentStatus = "pending";
    let transactionId = null;

    if (paymentMethod === "ONLINE") {
      const payment = await mockOnlinePayment();
      paymentStatus = payment.status;
      transactionId = payment.transactionId;
    }

    const res = await axios.post(
      `${API}/orders`,
      {
        // 🔧 BUY NOW FIX: use checkoutItems instead of cart
        items: checkoutItems.map((item) => ({
          productId: item.productId || item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
        // 🔧 BUY NOW FIX: correct total
        total: finalTotal,

        paymentMethod,
        paymentStatus,
        transactionId,
        shippingAddress: selectedAddress,
      },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    localStorage.setItem("lastOrder", JSON.stringify(res.data));

    // ✅ REDIRECT LOGIC (UNCHANGED)
    if (paymentMethod === "COD") {
      navigate("/payment-result?status=success");
    } else if (paymentStatus === "paid") {
      navigate("/payment-result?status=success");
    } else {
      navigate("/payment-result?status=failure");
    }

    setTimeout(() => {
      clearCart(); // cart clears, Buy Now unaffected
      setBuyNowItem(null);
    }, 0);
  } catch (err) {
    console.error(err);
    setLoading(false);
    navigate("/payment-failure");
  }
};

const computedSubtotal = checkoutItems.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);

const finalTotal = computedSubtotal;



  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs tracking-wider uppercase text-gray-400 mb-8">
          <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate("/cart")}>Cart</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Checkout</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight">Secure Checkout</h1>
          <p className="text-sm text-gray-500 mt-2">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT - Delivery Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* DELIVERY ADDRESS SECTION */}
            <div className="bg-slate-50 border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <h2 className="text-lg font-light tracking-wide">Delivery Address</h2>
                </div>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-xs text-amber-700 hover:text-amber-800 tracking-wide transition-colors"
                >
                  + Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 bg-white border border-slate-200">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <p className="text-sm text-gray-600 mb-4">No saved addresses found</p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 text-sm tracking-wide transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`block p-5 border cursor-pointer transition-all duration-200 ${
                        selectedAddress?._id === addr._id
                          ? "border-amber-700 bg-white shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?._id === addr._id}
                          onChange={() => setSelectedAddress(addr)}
                          className="mt-1 w-4 h-4 text-amber-700"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-sm">{addr.fullName}</p>
                            {addr.isDefault && (
                              <span className="inline-block px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs tracking-wider uppercase">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {addr.street}<br />
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                            {addr.phone}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* PAYMENT METHOD SECTION */}
            <div className="bg-slate-50 border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <h2 className="text-lg font-light tracking-wide">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className={`flex items-center gap-4 p-5 border cursor-pointer transition-all duration-200 ${
                  paymentMethod === "COD"
                    ? "border-amber-700 bg-white shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-4 h-4 text-amber-700"
                  />
                  <div className="flex-grow flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cash on Delivery</p>
                      <p className="text-xs text-gray-500 mt-0.5">Pay when you receive your order</p>
                    </div>
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label className={`flex items-center gap-4 p-5 border cursor-pointer transition-all duration-200 ${
                  paymentMethod === "ONLINE" && paymentMode === "CARD"
                    ? "border-amber-700 bg-white shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE" && paymentMode === "CARD"}
                    onChange={() => {
                      setPaymentMethod("ONLINE");
                      setPaymentMode("CARD");
                    }}
                    className="w-4 h-4 text-amber-700"
                  />
                  <div className="flex-grow flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Credit / Debit Card</p>
                      <p className="text-xs text-gray-500 mt-0.5">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                </label>

                {/* UPI Payment */}
                <label className={`flex items-center gap-4 p-5 border cursor-pointer transition-all duration-200 ${
                  paymentMethod === "ONLINE" && paymentMode === "UPI"
                    ? "border-amber-700 bg-white shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE" && paymentMode === "UPI"}
                    onChange={() => {
                      setPaymentMethod("ONLINE");
                      setPaymentMode("UPI");
                    }}
                    className="w-4 h-4 text-amber-700"
                  />
                  <div className="flex-grow flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">UPI Payment</p>
                      <p className="text-xs text-gray-500 mt-0.5">Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT - Order Summary */}
                    {/* RIGHT - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-8 sticky top-6">
              <h2 className="text-sm tracking-[0.2em] uppercase text-gray-600 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {checkoutItems.map((item) => (
                  <div key={item.productId || item._id}  className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-700 text-white text-xs rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-light leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Quantity: {item.qty}</p>
                    </div>
                    <span className="text-sm font-light whitespace-nowrap">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-6 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-light">₹{computedSubtotal}</span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-light text-amber-700">Complimentary</span>
                </div>
              </div>

              <div className="border-t border-slate-200 my-6"></div>

              {/* Total */}
              <div className="flex justify-between mb-8">
                <span className="text-sm tracking-wider uppercase text-gray-600">Total</span>
                <span className="text-2xl font-light tracking-wide">₹{finalTotal}</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={placeOrder}
                disabled={loading || !selectedAddress}
                className={`w-full py-4 text-sm tracking-wide transition-all duration-300 mb-4 ${
                  loading || !selectedAddress
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-amber-700 hover:bg-amber-800"
                } text-white`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  "Complete Order"
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                </svg>
                <span>Secure 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}