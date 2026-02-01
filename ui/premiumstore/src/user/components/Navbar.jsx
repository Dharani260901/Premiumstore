import { Link, useLocation,useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
// import { useSearch } from "../../context/SearchContext.jsx";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  
const { cartCount, clearCart } = useCart();

 
  const { user, logout } = useAuth();
  // const { query, setQuery } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        {/* LOGO */}
        <Link 
          to="/" 
          className="text-2xl font-light tracking-tight text-gray-900 hover:text-amber-700 transition-colors"
        >
          Premium<span className="font-serif italic">Store</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        {/* DESKTOP NAVIGATION */}
<nav className="hidden md:flex items-center gap-8">
  <NavLink to="/products" isActive={isActive("/products")}>
    Collections
  </NavLink>

  {/* FIXED CART LINK */}
  <Link 
    to="/cart" 
    className="flex items-center gap-2 text-sm tracking-wide text-gray-700 hover:text-amber-700 transition-colors"
  >
    <div className="relative"> {/* Container for Icon + Badge */}
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-700 text-white text-[10px] rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </div>
    <span>Cart</span> {/* Text is now safe from the absolute badge */}
  </Link>

          {user && user.token ? (
            <>
              <NavLink to="/orders" isActive={isActive("/orders")}>
                Orders
              </NavLink>
              
              {/* User Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm tracking-wide text-gray-700 hover:text-amber-700 transition-colors">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
  {user.profileImage ? (
    <img
      src={ user.profileImage
      ? user.profileImage.startsWith("http")
        ? user.profileImage
        : `http://localhost:5000${user.profileImage}`
      : "/avatar.png"
  }
      alt={user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <svg
      className="w-full h-full p-2 text-slate-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      />
    </svg>
  )}
</div>

                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs tracking-wider uppercase text-gray-400">Account</p>
                    <p className="text-sm font-medium mt-1 truncate">{user.name}</p>
                  </div>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 transition-colors"
                  >
                    Profile Settings
                  </Link>
                  <button 
                    onClick={() => {
    logout();
    clearCart(); 
    navigate("/login");   // ✅ GO HOME, NOT /login
  }}
                    
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                  >
                    Sign Out
                  </button>
                </div>
               

              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="text-sm tracking-wide text-gray-700 hover:text-amber-700 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 text-sm tracking-wide transition-colors"
              >
                Join Us
              </Link>
            </>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <nav className="px-6 py-4 space-y-4">
            <MobileNavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
              Collections
            </MobileNavLink>
            
            <MobileNavLink to="/cart" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center justify-between">
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="w-6 h-6 bg-amber-700 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </MobileNavLink>

            {user ? (
              <>
                <MobileNavLink to="/orders" onClick={() => setMobileMenuOpen(false)}>
                  My Orders
                </MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </MobileNavLink>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm text-red-600 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </MobileNavLink>
                <MobileNavLink to="/register" onClick={() => setMobileMenuOpen(false)}>
                  Join Us
                </MobileNavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

/* ================= NAV LINK COMPONENT ================= */
function NavLink({ to, isActive, children }) {
  return (
    <Link
      to={to}
      className={`text-sm tracking-wide transition-colors relative ${
        isActive 
          ? 'text-amber-700' 
          : 'text-gray-700 hover:text-amber-700'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-amber-700"></span>
      )}
    </Link>
  );
}

/* ================= MOBILE NAV LINK COMPONENT ================= */
function MobileNavLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-sm text-gray-700 hover:text-amber-700 transition-colors py-2"
    >
      {children}
    </Link>
  );
}