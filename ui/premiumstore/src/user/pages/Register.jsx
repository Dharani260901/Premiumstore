import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);

const handleRegister = async (e) => {
  e.preventDefault();
  if (loading) return;

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await register(
      name.trim(),
      email.trim(),
      password.trim()
    );

    setSuccess(res.message);
    setTimeout(() => navigate("/login"), 2500);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light tracking-tight mb-3">
            Create Account
          </h2>
          <p className="text-sm text-gray-500">
            Join us and start your shopping journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-50 p-10 border border-slate-100">
          <form onSubmit={handleRegister} className="space-y-6">

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 mt-2">
                Minimum 8 characters recommended
              </p>
            </div>

            {/* Submit */}
            <button
  disabled={loading}
  className={`w-full py-4 text-sm ${
    loading ? "bg-gray-400" : "bg-amber-700 hover:bg-amber-800"
  } text-white`}
>
  {loading ? "Creating..." : "Create Account"}
</button>
          </form>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-6 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-amber-700 hover:text-amber-800">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-amber-700 hover:text-amber-800">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Sign In */}
        <p className="text-sm text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-700 hover:text-amber-800 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
