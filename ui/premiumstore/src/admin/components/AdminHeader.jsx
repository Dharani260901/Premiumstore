import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function AdminHeader() {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch notifications on mount
  useEffect(() => {
    if (!admin?.token) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API}/admin/notifications`, {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });

        setNotifications(
          res.data.map(n => ({
            id: n._id,
            text: n.message,
            time: formatTime(n.createdAt),
            read: n.isRead,
            type: n.type,
            orderId: n.orderId,
          }))
        );
      } catch (error) {
        console.error("Failed to load notifications:", error);
        // Use mock data as fallback for development
        setNotifications([
          { id: 1, text: "New order #ORD1021 placed", time: "2 min ago", read: false, type: "order", orderId: "123" },
          { id: 2, text: "Order #ORD1018 cancelled", time: "15 min ago", read: false, type: "order", orderId: "124" },
          { id: 3, text: "Low stock alert: Premium Saree", time: "1 hour ago", read: true, type: "stock" },
          { id: 4, text: "Product #PRD456 updated successfully", time: "3 hours ago", read: true, type: "product" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [admin?.token]);

  // Format time helper
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const markAllRead = async () => {
    try {
      await axios.put(
        `${API}/admin/notifications/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      // Fallback to local state update
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  const markAsRead = async (id, event) => {
    // Prevent triggering handleNotificationClick
    if (event) {
      event.stopPropagation();
    }

    try {
      await axios.put(
        `${API}/admin/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Fallback to local state update
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    }
  };

  const deleteNotification = async (id, event) => {
    // Prevent triggering handleNotificationClick
    if (event) {
      event.stopPropagation();
    }

    try {
      await axios.delete(`${API}/admin/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
      // Fallback to local state update
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Close dropdown
    setOpen(false);

    // Navigate based on notification type
    if (notification.type === "order" && notification.orderId) {
      navigate(`/admin/orders`); // Navigate to orders page, filtering can be done there
    } else if (notification.type === "product") {
      navigate("/admin/products");
    } else if (notification.type === "stock") {
      navigate("/admin/products");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

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
        {/* 🔔 Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>

            {/* 🔴 Badge */}
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-amber-700 text-white text-xs font-medium rounded-full flex items-center justify-center shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* 🔽 Notification Dropdown */}
          {open && (
            <div className="absolute right-0 top-14 w-96 bg-white border border-slate-200 shadow-2xl rounded-lg z-50 overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <ul className="max-h-96 overflow-y-auto">
                {loading ? (
                  <li className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-gray-500">Loading notifications...</p>
                  </li>
                ) : notifications.length === 0 ? (
                  <li className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No notifications</p>
                    <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                  </li>
                ) : (
                  notifications.map(n => (
                    <li
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`group border-b border-slate-100 last:border-0 cursor-pointer transition-colors ${
                        n.read 
                          ? "bg-white hover:bg-slate-50" 
                          : "bg-amber-50 hover:bg-amber-100"
                      }`}
                    >
                      <div className="flex items-start gap-3 px-6 py-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          n.read ? "bg-slate-300" : "bg-amber-700"
                        }`}></div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <p className={`text-sm leading-relaxed ${
                            n.read ? "text-gray-600" : "text-gray-900 font-medium"
                          }`}>
                            {n.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <button
                              onClick={(e) => markAsRead(n.id, e)}
                              className="p-1 text-gray-400 hover:text-amber-700 transition-colors rounded hover:bg-amber-50"
                              title="Mark as read"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => deleteNotification(n.id, e)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>

              {/* Footer */}
              {notifications.length > 0 && !loading && (
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-center">
                  <button 
                    onClick={() => {
                      setOpen(false);
                      navigate("/admin/notifications");
                    }}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
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
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200 hover:border-red-200 rounded"
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