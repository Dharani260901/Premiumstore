import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col">
      {/* Brand Section */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-light tracking-tight text-gray-900">
          Premium<span className="font-serif italic text-amber-700">Store</span>
        </h2>
        <p className="text-xs tracking-wider uppercase text-gray-400 mt-2">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">Menu</p>
        <div className="space-y-2">
          <SidebarLink to="/admin" icon={<DashboardIcon />}>
            Dashboard
          </SidebarLink>

          <SidebarLink to="/admin/products" icon={<ProductsIcon />}>
            Products
          </SidebarLink>

          <SidebarLink to="/admin/orders" icon={<OrdersIcon />}>
            Orders
          </SidebarLink>
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
          </svg>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}

/* ================= SIDEBAR LINK COMPONENT ================= */
function SidebarLink({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-all duration-200 ${
          isActive
            ? "bg-amber-50 text-amber-700 border-l-2 border-amber-700"
            : "text-gray-600 hover:bg-slate-50 hover:text-gray-900 border-l-2 border-transparent"
        }`
      }
    >
      <span className="w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
      {children}
    </NavLink>
  );
}

/* ================= ICON COMPONENTS ================= */
function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  );
}