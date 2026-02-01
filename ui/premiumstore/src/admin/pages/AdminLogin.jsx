import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // ✅ UPDATED: axios instead of fetch


const API = "http://localhost:5000/api/auth"; // ✅ REQUIRED

export default function AdminLogin() {
  
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  /* ================= ADMIN LOGIN ================= */
  
   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/admin/login`, {
        email,
        password,
      });

      // ✅ STORE ADMIN SEPARATELY
      localStorage.setItem("admin", JSON.stringify(data));

      // 🔄 HARD REDIRECT (sync across tabs)
      window.location.href = "/admin";
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-lg">
        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-6 text-center">
          <h1 className="text-2xl font-light tracking-wide text-gray-900">
            Admin Login
          </h1>
          <p className="text-xs tracking-widest uppercase text-gray-400 mt-2">
            Authorized users only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-slate-300 focus:border-amber-700 focus:outline-none"
              placeholder="admin@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-slate-300 focus:border-amber-700 focus:outline-none"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white py-3 text-sm tracking-wide transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-slate-200 px-8 py-4 text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
