import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

const API = "http://localhost:5000/api";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  /* 🔁 LOAD USER ORDERS FROM BACKEND */
  useEffect(() => {
    if (!user?.token) return;

    axios
      .get(`${API}/orders/my`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.token]);

const getEstimatedDelivery = (order) => {
  if (!order?.estimatedDeliveryDate) return null;

  // Delivered → show delivered date
  if (order.status?.toLowerCase() === "delivered") {
    const deliveredAt = order.deliveredAt || order.updatedAt;

    return {
      label: "Delivered On",
      date: new Date(deliveredAt),
      color: "text-green-700",
    };
  }

  // Otherwise → show ETA from DB
  return {
    label: "Estimated Delivery",
    date: new Date(order.estimatedDeliveryDate),
    color: "text-amber-700",
  };
};


  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (orders.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        
        <h2 className="text-3xl font-light tracking-wide mb-3">No Orders Yet</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-sm text-center">
          Start exploring our curated collections and place your first order
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

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400">Your Orders</p>
            <span className="text-xs tracking-wider uppercase text-gray-400 bg-slate-50 px-3 py-1.5 border border-slate-100">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
          <h1 className="text-4xl font-light tracking-tight mb-2">Order History</h1>
          <p className="text-sm text-gray-500">
            Track and manage your purchases
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center gap-3 pb-6 border-b border-slate-100">
          <p className="text-sm text-gray-600 mr-2">Filter:</p>
          {["All", "Placed", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm tracking-wide transition-all duration-200 ${
                filter === status
                  ? "bg-amber-700 text-white"
                  : "bg-slate-50 text-gray-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 border border-slate-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-light mb-2">No {filter !== "All" && filter.toLowerCase()} orders found</h3>
            <p className="text-sm text-gray-500">
              {filter !== "All" ? `You don't have any ${filter.toLowerCase()} orders` : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                getEstimatedDelivery={getEstimatedDelivery}
              />
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-gray-500 mb-3">Need assistance with an order?</p>
          <Link 
            to="/support" 
            className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ================= ORDER CARD COMPONENT ================= */
function OrderCard({ order, getEstimatedDelivery }) {
  return (
    <div className="bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all duration-300">
      <div className="p-8">
        
        {/* Order Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs tracking-wider uppercase text-gray-400 mb-1">
              Order ID
            </p>
            <p className="text-sm font-mono tracking-wide">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs tracking-wider uppercase text-gray-400 mb-1">
                Order Date
              </p>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>

            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="space-y-4 mb-6">
          {/* First Item (Featured) */}
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={order.items[0].image}
                alt={order.items[0].name}
                className="w-24 h-24 object-cover border border-slate-200"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-light text-lg tracking-wide mb-1">
                {order.items[0].name}
              </h3>
              <p className="text-sm text-gray-500">
                Quantity: {order.items[0].qty} × ₹{order.items[0].price}
              </p>
            </div>
            <div className="text-right">
              <p className="font-light text-lg">₹{order.items[0].price * order.items[0].qty}</p>
            </div>
          </div>

         
        </div>

        {/* Payment Info */}
        <div className="bg-white border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Payment Method</p>
              <p className="font-medium">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Payment Status</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs tracking-wider uppercase ${
                order.paymentStatus === "paid"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-orange-50 text-orange-700 border border-orange-200"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {order.paymentStatus === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Order Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <div>
            <p className="text-xs tracking-wider uppercase text-gray-400 mb-1">
              Order Total
            </p>
            <p className="text-2xl font-light tracking-wide">₹{order.total.toLocaleString('en-IN')}</p>
          </div>

         {/* ETA */}
{(() => {
  const etaInfo = getEstimatedDelivery(order);
  if (!etaInfo) return null;

  return (
    <div>
      <p className="text-xs tracking-wider uppercase text-gray-400 mb-1">
        {etaInfo.label}
      </p>
      <p className={`text-sm font-medium ${etaInfo.color}`}>
        {etaInfo.date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
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


          <Link
            to={`/orders/${order._id}`}
            className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 text-sm tracking-wide transition-colors duration-300"
          >
            View Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ================= STATUS BADGE COMPONENT ================= */
function StatusBadge({ status }) {
  const getStatusConfig = () => {
    const statusLower = status?.toLowerCase();
    
    const configs = {
      placed: {
        style: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      },
      pending: {
        style: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      processing: {
        style: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
      },
      shipped: {
        style: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
      },
      delivered: {
        style: 'bg-green-50 text-green-700 border-green-200',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      cancelled: {
        style: 'bg-red-50 text-red-700 border-red-200',
        icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    };

    return configs[statusLower] || {
      style: 'bg-slate-50 text-slate-700 border-slate-200',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs tracking-wider uppercase ${config.style}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={config.icon}/>
      </svg>
      {status}
    </span>
  );
}