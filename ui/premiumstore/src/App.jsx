import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* Auth */
import { useAuth } from "./context/AuthContext.jsx";

/* User Layout */
import Navbar from "./user/components/Navbar.jsx";
import Footer from "./user/components/Footer.jsx";

/* User Pages */
import Home from "./user/pages/Home.jsx";
import Products from "./user/pages/Products.jsx";
import ProductDetail from "./user/pages/ProductDetail.jsx";
import Cart from "./user/pages/Cart.jsx";
import Checkout from "./user/pages/Checkout.jsx";
import OrderSuccess from "./user/pages/OrderSuccess.jsx";
import Login from "./user/pages/Login.jsx";
import Register from "./user/pages/Register.jsx";
import Orders from "./user/pages/Orders.jsx";
import OrderDetail from "./user/pages/OrderDetail.jsx";
import Profile from "./user/pages/Profile.jsx";
import VerifyEmail from "./user/pages/VerifyEmail.jsx";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import PaymentResult from "./user/pages/PaymentResult";
import Invoice from "./user/pages/Invoice";

/* Route Guards */
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

/* Admin Layout & Pages */
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import AdminProducts from "./admin/pages/AdminProducts.jsx";
import AdminOrders from "./admin/pages/AdminOrders.jsx";

import ScrollToTop from "./user/components/ScrollToTop";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { user, authLoading } = useAuth();

  /* =====================================================
     BLOCK UI UNTIL AUTH STATE IS READY (NO LOGIN FLASH)
  ===================================================== */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin" />
      </div>
    );
  }


  return (
    <>
    <ScrollToTop />
      {/* Hide Navbar on admin pages */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* ================= USER ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route path="/order-success" element={<OrderSuccess />} />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

<Route path="/payment-result" element={<PaymentResult />} />


<Route path="/orders/:id/invoice" element={<Invoice />} />


        
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
    <Route
  path="/login"
  element={
    authLoading ? null : user ? <Navigate to="/" replace /> : <Login />
  }
/>


<Route path="/admin/login" element={<AdminLogin />} />

<Route path="/admin" element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route index element={<Navigate to="dashboard" />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="orders" element={<AdminOrders />} />
  </Route>
</Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Hide Footer on admin pages */}
      {!isAdminRoute && <Footer />}
    </>
  );
}
