import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

const API = "http://localhost:5000/api";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    axios
      .get(`${API}/orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/orders");
      });
  }, [id, user?.token, navigate]);

const getEstimatedDelivery = (order) => {
  if (!order?.estimatedDeliveryDate) return null;

  if (order.status?.toLowerCase() === "delivered") {
    const deliveredAt = order.deliveredAt || order.updatedAt;

    return {
      label: "Delivered On",
      date: new Date(deliveredAt),
      color: "text-green-700",
    };
  }

  return {
    label: "Estimated Delivery",
    date: new Date(order.estimatedDeliveryDate),
    color: "text-amber-700",
  };
};

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const isCOD = order.paymentMethod === "COD";
  const isPaid = order.paymentStatus === "paid";

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs tracking-wider uppercase text-gray-400 mb-8">
          <Link to="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/orders" className="hover:text-gray-600 transition-colors">
            Orders
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Order Details</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">
                Order Details
              </p>
              <h1 className="text-4xl font-light tracking-tight mb-3">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <span>
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon />
              <span>
                {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Track Order Timeline */}
        <TrackOrderTimeline
          status={order.status}
          history={order.statusHistory || []}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <section className="bg-slate-50 border border-slate-100 p-8">
              <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">
                Order Items ({order.items?.length || 0})
              </h2>

              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-6 bg-white p-6 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover border border-slate-200"
                    />

                    <div className="flex-grow">
                      <p className="text-lg font-light mb-2">{item.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Quantity: {item.qty}</span>
                        <span>×</span>
                        <span>₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-medium">
                        ₹{(item.qty * item.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <section className="bg-slate-50 border border-slate-100 p-8">
                <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6 flex items-center gap-2">
                  <LocationIcon />
                  Delivery Address
                </h2>

                <div className="bg-white p-6 border border-slate-100">
                  <p className="font-medium text-sm mb-2">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.pincode}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon />
                    {order.shippingAddress.phone}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 border border-slate-100 p-8 sticky top-6">
              <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {/* Estimated Delivery */}
                {/* Estimated Delivery */}
{(() => {
  const etaInfo = getEstimatedDelivery(order);
  if (!etaInfo) return null;

  return (
    <div className="bg-white p-4 border border-slate-100">
      <p className="text-xs text-gray-500 mb-2">
        {etaInfo.label}
      </p>
      <p className={`text-sm font-medium ${etaInfo.color}`}>
        {etaInfo.date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        at{" "}
        {etaInfo.date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
})()}


                {/* Payment Method */}
                <div className="bg-white p-4 border border-slate-100">
                  <p className="text-xs text-gray-500 mb-2">Payment Method</p>
                  <div className="flex items-center gap-2">
                    {isCOD ? <CashIcon /> : <CardIcon />}
                    <span className="text-sm font-medium">
                      {isCOD ? "Cash on Delivery" : "Online Payment"}
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="bg-white p-4 border border-slate-100">
                  <p className="text-xs text-gray-500 mb-2">Payment Status</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs tracking-wider uppercase ${
                      isPaid
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-orange-50 text-orange-700 border border-orange-200"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {isPaid ? "Paid" : "Pending"}
                  </span>
                </div>

                {/* Transaction ID */}
                {order.transactionId && (
                  <div className="bg-white p-4 border border-slate-100">
                    <p className="text-xs text-gray-500 mb-2">Transaction ID</p>
                    <p className="text-xs font-mono text-gray-700 break-all">
                      {order.transactionId}
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-slate-200 mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs tracking-wider uppercase text-gray-600">
                    Total Amount
                  </span>
                  <span className="text-3xl font-light tracking-wide">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
                {isCOD && !isPaid && (
                  <p className="text-xs text-gray-500 mt-2">
                    Pay ₹{order.total.toLocaleString('en-IN')} when the order is delivered.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  to={`/orders/${order._id}/invoice`}
                  className="flex items-center justify-center gap-2 w-full bg-amber-700 hover:bg-amber-800 text-white py-3 text-sm tracking-wide transition-colors duration-300"
                >
                  <InvoiceIcon />
                  View Invoice
                </Link>

                <Link
                  to="/orders"
                  className="block w-full border border-slate-200 hover:border-slate-300 bg-white text-gray-700 py-3 text-sm tracking-wide transition-colors duration-300 text-center"
                >
                  Back to Orders
                </Link>
              </div>

              {/* Help */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-gray-500 mb-3">
                  Need help with your order?
                </p>
                <Link
                  to="/support"
                  className="text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= TRACK ORDER TIMELINE ================= */
function TrackOrderTimeline({ status, history }) {
  const steps = [
    {
      key: "placed",
      label: "Order Placed",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status?.toLowerCase());
  const isCancelled = status?.toLowerCase() === "cancelled";

  return (
    <section className="bg-white border border-slate-100 p-8">
      <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-8">
        Order Tracking
      </h2>

      {isCancelled ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-lg font-light text-red-700 mb-2">
            Order Cancelled
          </p>
          <p className="text-sm text-gray-500">This order has been cancelled</p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="relative mb-12">
            <div className="flex justify-between items-center relative z-10">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center flex-1"
                  >
                    {/* Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-amber-700 border-amber-700"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={step.icon}
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d={step.icon}
                          />
                        </svg>
                      )}
                    </div>

                    {/* Label */}
                    <p
                      className={`mt-3 text-xs tracking-wider uppercase transition-colors ${
                        isCompleted
                          ? "text-amber-700 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>

                    {/* Connecting Line */}
                    {idx < steps.length - 1 && (
                      <div
                        className="absolute top-6 left-0 w-full h-0.5 -z-10"
                        style={{
                          left: `${(idx + 0.5) * (100 / steps.length)}%`,
                          width: `${100 / steps.length}%`,
                        }}
                      >
                        <div
                          className={`h-full transition-all duration-300 ${
                            idx < currentIndex ? "bg-amber-700" : "bg-slate-300"
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status History */}
          {history && history.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-4">
                Status History
              </p>
              <div className="space-y-4">
                {history.map((h, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-700 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="text-sm font-medium capitalize">
                        {h.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(h.date).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
/* ================= STATUS BADGE ================= */
function StatusBadge({ status }) {
  const styles = {
    placed: "bg-amber-50 text-amber-700 border-amber-200",
    shipped: "bg-blue-50 text-blue-700 border-blue-200",
    delivered: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const icons = {
    placed:
      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    shipped:
      "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
    delivered: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    cancelled:
      "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  const statusLower = status?.toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 border text-xs tracking-wider uppercase ${
        styles[statusLower] || "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={icons[statusLower] || icons.placed}
        />
      </svg>
      {status}
    </span>
  );
}

/* ================= ICON COMPONENTS ================= */
function CalendarIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
    </svg>
  );
}

function CashIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
    </svg>
  );
}

function InvoiceIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  );
}