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
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 py-16">
      
      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        {/* Animated ring */}
        <div className="absolute inset-0 w-24 h-24 border-2 border-green-200 rounded-full animate-ping opacity-20"></div>
      </div>

      {/* Header */}
      <h1 className="text-4xl font-light tracking-tight mb-3">Order Confirmed</h1>
      <p className="text-gray-500 text-sm mb-12 max-w-md text-center">
        Thank you for your purchase. Your order has been successfully placed.
      </p>

      {/* Order Details Card */}
      <div className="bg-slate-50 border border-slate-100 p-8 w-full max-w-lg mb-8">
        
        {/* Order Number */}
        <div className="text-center pb-6 mb-6 border-b border-slate-200">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">Order Number</p>
          <p className="text-2xl font-light tracking-wide font-mono">
            #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Order Info Items */}
        <div className="space-y-6">
          
          {/* Email Confirmation */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium tracking-wide mb-1">Confirmation Email Sent</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Order details and receipt have been sent to your email address
              </p>
            </div>
          </div>

          {/* Delivery Updates */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium tracking-wide mb-1">Track Your Delivery</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                You'll receive updates via email and SMS as your order progresses
              </p>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium tracking-wide mb-1">Estimated Delivery</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your order will arrive within 5-7 business days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
        <Link
          to="/orders"
          className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 text-sm tracking-wide transition-colors duration-300"
        >
          View Order Details
        </Link>

        <Link
          to="/products"
          className="border border-slate-200 hover:border-slate-300 bg-white text-gray-700 px-8 py-4 text-sm tracking-wide transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Help Section */}
      <div className="mt-12 pt-8 border-t border-slate-100 text-center max-w-lg">
        <p className="text-sm text-gray-500 mb-3">Questions about your order?</p>
        <Link 
          to="/support" 
          className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors"
        >
          Contact Support →
        </Link>
      </div>
    </div>
  );
}