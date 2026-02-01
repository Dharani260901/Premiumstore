import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


export default function AdminDashboard() {
  // 🔥 ADMIN COMES FROM localStorage (CORRECT)
  const admin = JSON.parse(localStorage.getItem("admin"));

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

   useEffect(() => {
    // 🔥 SAFETY CHECK (IMPORTANT)
    if (!admin?.token) return;

    Promise.all([
      axios.get("http://localhost:5000/api/products"),
      axios.get("http://localhost:5000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${admin.token}`, // ✅ CORRECT
        },
      }),
    ])
      .then(([productsRes, ordersRes]) => {
        const orders = ordersRes.data;

        setStats({
          totalProducts: productsRes.data.length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
          pendingOrders: orders.filter(
            (o) => o.status?.toLowerCase() === "placed"
          ).length,
        });
      })
      .catch((err) => {
        console.error("Admin dashboard error:", err);
      });
  }, [admin?.token]); // 🔥 FIXED dependency

  // 🔥 OPTIONAL: Guard UI (recommended)
  if (!admin) {
    return (
      <div className="p-8 text-center text-red-600">
        Unauthorized access
      </div>
    );
  }


  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">Welcome Back</p>
        <h1 className="text-4xl font-light tracking-tight">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
          <p className="text-xs tracking-wider uppercase text-gray-400 mb-2">Total Products</p>
          <p className="text-3xl font-light">{stats.totalProducts}</p>
        </div>

        <div className="bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <p className="text-xs tracking-wider uppercase text-gray-400 mb-2">Total Orders</p>
          <p className="text-3xl font-light">{stats.totalOrders}</p>
        </div>

        <div className="bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 border border-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p className="text-xs tracking-wider uppercase text-gray-400 mb-2">Total Revenue</p>
          <p className="text-3xl font-light">₹{stats.totalRevenue}</p>
        </div>

        <div className="bg-white border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 border border-orange-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p className="text-xs tracking-wider uppercase text-gray-400 mb-2">Pending Orders</p>
          <p className="text-3xl font-light">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/products"
            className="group bg-white border border-slate-100 hover:border-amber-700 p-8 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-100 flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-amber-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
            <h3 className="text-xl font-light tracking-wide mb-2">Manage Products</h3>
            <p className="text-sm text-gray-500">
              Add, edit, or remove products from your inventory
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="group bg-white border border-slate-100 hover:border-amber-700 p-8 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-100 flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-amber-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
            <h3 className="text-xl font-light tracking-wide mb-2">Manage Orders</h3>
            <p className="text-sm text-gray-500">
              View and update order status and details
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}