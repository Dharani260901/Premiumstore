import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { query, setQuery } = useSearch();
  const { cartCount } = useCart(); // ✅ NUMBER
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e) => {
    setQuery(e.target.value);
    navigate("/products");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-orange-500 text-white w-9 h-9 flex items-center justify-center rounded-lg font-bold">
            P
          </div>
          <span className="font-semibold text-lg">PremiumStore</span>
        </Link>

        {/* SEARCH */}
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search products..."
          className="w-1/2 px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
        />

        {/* CART */}
        <Link to="/cart" className="relative text-xl">
          🛒
          {cartCount > 0 && (   /* ✅ NO () */
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}       {/* ✅ NUMBER */}
            </span>
          )}
        </Link>

         {/* LOGIN / PROFILE */}
          {!user ? (
            <Link to="/login" className="text-sm font-medium hover:text-orange-500">
              Sign In
            </Link>
          ) : (
            <Link to="/profile" className="text-sm font-medium hover:text-orange-500">
              My Account
            </Link>
          )}

      </div>
    </header>
  );
}
