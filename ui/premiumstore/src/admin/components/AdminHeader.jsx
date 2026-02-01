import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function AdminHeader() {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const navigate = useNavigate();

   const handleLogout = () => {
    // 🔥 CLEAR ADMIN SESSION
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

   // 🔐 Safety guard
  if (!admin) return null;

  return (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center">
      {/* Left Section */}
      <div>
        <p className="text-xs tracking-wider uppercase text-gray-400">Administrator</p>
        <h1 className="text-lg font-light tracking-wide text-gray-900">
          Welcome back, {admin.name}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-700 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{admin.name}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200 hover:border-red-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}