import { Routes, Route, Navigate } from "react-router-dom";

/* Layout */
import UserLayout from "../layouts/UserLayout";

/* Pages */
import Home from "../user/pages/Home";
import Products from "../user/pages/Products";
import ProductDetail from "../user/pages/ProductDetail";
import Cart from "../user/pages/Cart";
import Checkout from "../user/pages/Checkout";
import Orders from "../user/pages/Orders";
import OrderDetail from "../user/pages/OrderDetail";
import Profile from "../user/pages/Profile";
import Login from "../user/pages/Login";
import Register from "../user/pages/Register";
import VerifyEmail from "../user/pages/VerifyEmail";
import PaymentResult from "../user/pages/PaymentResult";
import Invoice from "../user/pages/Invoice";

/* Guards */
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

/* Admin */
import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminProducts from "../admin/pages/AdminProducts";
import AdminOrders from "../admin/pages/AdminOrders";
import AdminLogin from "../admin/pages/AdminLogin";

export default function AppRoutes() {
  return (
    <Routes>

      {/* USER LAYOUT */}
      <Route element={<UserLayout />}>

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

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/orders/:id/invoice" element={<Invoice />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}