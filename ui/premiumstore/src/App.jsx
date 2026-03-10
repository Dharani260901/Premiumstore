import { useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./user/components/ScrollToTop";

export default function App() {
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}