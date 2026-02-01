import { useState,useEffect } from "react";
import { Link, useNavigate ,useLocation} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ✅ LOGIN
      await login(email, password);

      // ✅ REDIRECT BACK TO PREVIOUS PAGE
      navigate(from, { replace: true });
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light tracking-tight mb-3">Welcome Back</h2>
          <p className="text-sm text-gray-500">Sign in to continue your shopping experience</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-50 p-10 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-xs text-gray-500 hover:text-amber-700 transition-colors tracking-wide"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-4 text-sm tracking-wide transition-colors duration-300 mt-8"
            >
              Sign In
            </button>
          </form>

         

          
        </div>

        {/* Sign Up Link */}
        <p className="text-sm text-center mt-8 text-gray-600">
          New to our store?{" "}
          <Link 
            to="/register" 
            className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
          >
            Create an account
          </Link>
        </p>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
          </svg>
          <span>Secure login with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}