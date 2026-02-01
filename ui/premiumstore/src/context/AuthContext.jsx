import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API = "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* =====================================================
     LOAD USER FROM LOCAL STORAGE (REHYDRATE)
  ===================================================== */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse user from storage");
      localStorage.removeItem("user");
    } finally {
      setAuthLoading(false);
    }
     // ✅ auth check done
  }, []);

  /* =====================================================
     LOGIN
  ===================================================== */
  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  /* =====================================================
     REGISTER
  ===================================================== */
  const register = async (name, email, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    return data;
  };

  /* =====================================================
     LOGOUT (FULL CLEANUP)
  ===================================================== */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  localStorage.removeItem("lastOrder");
  };

  /* =====================================================
     AUTH FETCH (AUTO LOGOUT ON TOKEN EXPIRY)
  ===================================================== */
  const authFetch = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(user?.token && { Authorization: `Bearer ${user.token}` }),
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });

    // 🔥 TOKEN EXPIRED → FULL LOGOUT
    if (res.status === 401) {
      logout();
      throw new Error("Session expired. Please login again.");
    }

    return res;
  };

  /* =====================================================
     UPDATE USER (PROFILE IMAGE / NAME ETC)
  ===================================================== */
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  /* =====================================================
     IMPORTANT: BLOCK UI UNTIL AUTH READY
  ===================================================== */
  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading, 
        login,
        register,
        logout,
        authFetch,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
