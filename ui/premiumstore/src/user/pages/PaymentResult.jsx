import { Link, useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const status = params.get("status"); // success | failure
  const order = JSON.parse(localStorage.getItem("lastOrder"));

  const isSuccess = status === "success";
  const isCOD = order?.paymentMethod === "COD";
  const displayPaymentStatus =
  order?.paymentMethod === "COD" ? "pending" : order?.paymentStatus;

const isPaid = displayPaymentStatus === "paid";


  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-16">
      <div className="max-w-md w-full text-center">

        {/* ICON */}
        <div className="relative mb-8 mx-auto w-20 h-20">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${
              isSuccess
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            {isSuccess ? (
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          {isSuccess && (
            <div className="absolute inset-0 w-20 h-20 border-2 border-green-200 rounded-full animate-ping opacity-20"></div>
          )}
        </div>

        {/* TITLE */}
        <h1
          className={`text-3xl font-light tracking-tight mb-3 ${
            isSuccess ? "text-green-700" : "text-red-700"
          }`}
        >
          {isSuccess
            ? isCOD
              ? "Order Placed Successfully"
              : "Payment Successful"
            : "Payment Failed"}
        </h1>

        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          {isSuccess ? (
            isCOD
              ? "Your order has been placed successfully. Please pay the amount when the order is delivered."
              : "Your payment has been processed successfully and your order has been confirmed. You will receive a confirmation email shortly."
          ) : (
            "Unfortunately, your payment could not be completed. No amount has been deducted from your account. Please try again or contact support if the issue persists."
          )}
        </p>

        {/* SUCCESS: ORDER DETAILS */}
        {isSuccess && order && (
          <>
            <div className="bg-slate-50 border border-slate-100 p-6 mb-8 text-left">
              <p className="text-xs tracking-wider uppercase text-gray-400 mb-4">
                Order Details
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono font-medium">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>

                {/* PAYMENT STATUS */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Status:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs tracking-wider uppercase ${
                      isPaid
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-orange-50 text-orange-700 border border-orange-200"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {displayPaymentStatus}

                  </span>
                </div>

                {/* AMOUNT PAID */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium text-lg">
                    ₹{isCOD ? 0 : order.total}
                  </span>
                </div>

                {/* COD NOTE */}
                {isCOD && (
                  <p className="text-xs text-gray-500 mt-1">
                    Pay ₹{order.total} when the order is delivered
                  </p>
                )}

                {/* TRANSACTION ID */}
                {order.transactionId && (
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-gray-500 mb-1">
                      Transaction ID:
                    </p>
                    <p className="text-xs font-mono text-gray-700 break-all">
                      {order.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* WHAT’S NEXT */}
            <div className="bg-amber-50 border border-amber-200 p-4 mb-8 text-left">
              <p className="text-xs tracking-wider uppercase text-amber-700 mb-3">
                What's Next?
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>📧 Confirmation email sent to your inbox</li>
                <li>📦 Order will be processed within 24 hours</li>
                <li>📍 Track your order in the Orders section</li>
              </ul>
            </div>
          </>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3">
          {isSuccess ? (
            <>
              <Link
                to="/orders"
                className="bg-amber-700 hover:bg-amber-800 text-white py-4 text-sm tracking-wide"
              >
                View My Orders
              </Link>

              <Link
                to="/products"
                className="border border-slate-200 bg-white text-gray-700 py-4 text-sm"
              >
                Continue Shopping
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/checkout"
                className="bg-amber-700 hover:bg-amber-800 text-white py-4 text-sm"
              >
                Retry Payment
              </Link>

              <Link
                to="/cart"
                className="border border-slate-200 bg-white text-gray-700 py-4 text-sm"
              >
                Back to Cart
              </Link>
            </>
          )}

          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-amber-700 mt-2"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
