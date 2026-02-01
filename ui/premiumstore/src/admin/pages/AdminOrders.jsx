import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  // 🔥 CHANGED: use admin from localStorage
  const admin = JSON.parse(localStorage.getItem("admin"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  useEffect(() => {
    if (!admin?.token) return;

    axios
      .get("http://localhost:5000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${admin.token}`
        }
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [admin?.token]);

  const updateStatus = async (id, status) => {
    // 1️⃣ Optimistic UI update (instant)
    setOrders((prev) =>
      prev.map((o) => {
        if (o._id.toString() !== id.toString()) return o;

        const updated = { ...o, status };

        // COD → Delivered → Paid
        if (o.paymentMethod === "COD" && status === "Delivered") {
          updated.paymentStatus = "paid";
        }

        return updated;
      })
    );

    try {
      // 2️⃣ Sync with backend
      const { data: updatedOrder } = await axios.put(
        `http://localhost:5000/api/admin/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      // 3️⃣ Replace with server truth
      setOrders((prev) =>
        prev.map((o) =>
          o._id.toString() === updatedOrder._id.toString()
            ? updatedOrder
            : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
      
      // Revert optimistic update on error
      setOrders((prev) =>
        prev.map((o) => {
          if (o._id.toString() !== id.toString()) return o;
          // Find original order to revert to
          const original = orders.find(ord => ord._id.toString() === id.toString());
          return original || o;
        })
      );
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const isLate = (order) => {
    if (!order.estimatedDeliveryDate) return false;
    if (order.status === "Delivered") return false;
    return new Date() > new Date(order.estimatedDeliveryDate);
  };

  // Apply both filters
  const filteredOrders = orders.filter((o) => {
    const statusMatch = filter === "All" || o.status.toLowerCase() === filter.toLowerCase();
    const paymentMatch = paymentFilter === "All" || o.paymentMethod === paymentFilter;
    return statusMatch && paymentMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">Order Management</p>
        <h1 className="text-3xl font-light tracking-tight">Orders</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <StatCard
          label="Total Orders"
          value={orders.length}
          icon={<OrdersIcon />}
        />
        <StatCard
          label="Pending"
          value={orders.filter(o => o.status.toLowerCase() === 'placed').length}
          icon={<PendingIcon />}
          color="orange"
        />
        <StatCard
          label="Shipped"
          value={orders.filter(o => o.status.toLowerCase() === 'shipped').length}
          icon={<ShippedIcon />}
          color="blue"
        />
        <StatCard
          label="COD Orders"
          value={orders.filter(o => o.paymentMethod === 'COD').length}
          icon={<CashIcon />}
          color="purple"
        />
        <StatCard
          label="Total Revenue"
          value={`₹${orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('en-IN')}`}
          icon={<RevenueIcon />}
          color="green"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 p-6 mb-6">
        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-3">Order Status</p>
          <div className="flex flex-wrap gap-3">
            {["All", "Placed", "Shipped", "Delivered", "Cancelled"].map((status) => (
              <FilterButton
                key={status}
                active={filter === status}
                onClick={() => setFilter(status)}
                label={status}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-3">Payment Method</p>
          <div className="flex flex-wrap gap-3">
            {["All", "COD", "ONLINE"].map((method) => (
              <FilterButton
                key={method}
                active={paymentFilter === method}
                onClick={() => setPaymentFilter(method)}
                label={method === "All" ? "All Methods" : method}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState filter={filter} paymentFilter={paymentFilter} />
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((o) => (
            <OrderCard
              key={o._id}
              order={o}
              onUpdateStatus={updateStatus}
              formatDate={formatDate}
              isLate={isLate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= STAT CARD COMPONENT ================= */
function StatCard({ label, value, icon, color = "default" }) {
  const colorClasses = {
    default: "bg-slate-50 border-slate-100 text-slate-600",
    orange: "bg-orange-50 border-orange-100 text-orange-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
    green: "bg-green-50 border-green-100 text-green-600",
  };

  return (
    <div className="bg-white border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-xs tracking-wider uppercase text-gray-400 mb-2">{label}</p>
      <p className="text-3xl font-light">{value}</p>
    </div>
  );
}

/* ================= FILTER BUTTON COMPONENT ================= */
function FilterButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 text-sm tracking-wide transition-all duration-200 ${
        active
          ? "bg-amber-700 text-white shadow-sm"
          : "bg-slate-50 text-gray-700 hover:bg-slate-100 border border-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

/* ================= ORDER CARD COMPONENT ================= */
function OrderCard({ order, onUpdateStatus, formatDate, isLate }) {
  return (
    <div className="bg-white border border-slate-100 hover:shadow-md transition-all duration-200">
      {/* Order Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <OrderInfo label="Order ID" value={`#${order._id.slice(-8).toUpperCase()}`} mono />
          <OrderInfo 
            label="Date" 
            value={formatDate(order.createdAt)}
          />
         <OrderInfo 
  label="Customer" 
  value={order.user?.name || "Deleted user"}
  subtitle={order.user?.email}
/>

          <OrderInfo 
            label="Total" 
            value={`₹${order.total.toLocaleString('en-IN')}`}
            large
          />
          
          {/* ETA Info */}
          {order.estimatedDeliveryDate && (
            <div>
              <p className="text-xs tracking-wider uppercase text-gray-400 mb-1">ETA</p>
              <p className={`text-sm ${isLate(order) ? "text-red-600 font-medium" : "text-gray-700"}`}>
                {formatDate(order.estimatedDeliveryDate)}
              </p>
              <p className="text-xs text-gray-500">{order.estimatedDeliveryDays} days</p>
              {isLate(order) && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-50 text-red-700 border border-red-200">
                  Delayed
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Payment Information */}
          <InfoCard
            title="Payment Details"
            icon={<PaymentIcon />}
          >
            <InfoRow 
              label="Method" 
              value={order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"} 
            />
            <InfoRow 
              label="Status"
              value={
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs tracking-wider uppercase ${
                  order.paymentStatus === "paid"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-orange-50 text-orange-700 border border-orange-200"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                </span>
              }
            />
            {order.transactionId && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-gray-500 mb-1">Transaction ID:</p>
                <p className="text-xs font-mono text-gray-700 break-all">{order.transactionId}</p>
              </div>
            )}
          </InfoCard>

          {/* Shipping Address */}
          <InfoCard
            title="Shipping Address"
            icon={<LocationIcon />}
          >
            {order.shippingAddress ? (
              <div className="space-y-1">
                <p className="text-sm font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <div className="flex items-center gap-2 pt-2 text-xs text-gray-600">
                  <PhoneIcon />
                  {order.shippingAddress.phone}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No address provided</p>
            )}
          </InfoCard>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-3">
            Order Items ({order.items?.length || 0})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-3">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-sm text-gray-600">Update Order Status:</p>
          <select
            value={String(order.status)}
            onChange={(e) => onUpdateStatus(order._id.toString(), e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none text-sm transition-colors cursor-pointer"
          >
            <option value="Placed">Placed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */
function OrderInfo({ label, value, subtitle, mono, large }) {
  return (
    <div>
      <p className="text-xs tracking-wider uppercase text-gray-400 mb-1">{label}</p>
      <p className={`${mono ? 'font-mono' : 'font-medium'} ${large ? 'text-lg font-light' : 'text-sm'}`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <div className="bg-slate-50 border border-slate-100 p-4">
      <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-3 flex items-center gap-2">
        {icon}
        {title}
      </p>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}:</span>
      {typeof value === 'string' ? (
        <span className="text-sm font-medium">{value}</span>
      ) : (
        value
      )}
    </div>
  );
}

function EmptyState({ filter, paymentFilter }) {
  return (
    <div className="text-center py-20 bg-white border border-slate-100">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <h3 className="text-2xl font-light tracking-wide mb-3">No Orders Found</h3>
      <p className="text-sm text-gray-500">
        {filter === "All" && paymentFilter === "All"
          ? "No orders have been placed yet"
          : "No orders match the selected filters"}
      </p>
    </div>
  );
}

/* ================= ICONS ================= */
function OrdersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  );
}

function ShippedIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
    </svg>
  );
}

function CashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
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
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
    </svg>
  );
}