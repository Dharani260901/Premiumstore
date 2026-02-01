import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;
  
    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/verify/${token}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setStatus("success");
        setMessage("Email verified successfully! Redirecting to login…");

        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Invalid or expired verification link");

        setTimeout(() => navigate("/"), 4000);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">

        {/* Loading State */}
        {status === "loading" && (
          <>
            <div className="w-20 h-20 mx-auto mb-8 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin"></div>
            <h2 className="text-2xl font-light tracking-wide mb-3">Verifying Email</h2>
            <p className="text-sm text-gray-500">Please wait while we verify your email address...</p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="relative mb-8 mx-auto w-20 h-20">
              <div className="w-20 h-20 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div className="absolute inset-0 w-20 h-20 border-2 border-green-200 rounded-full animate-ping opacity-20"></div>
            </div>
            <h2 className="text-3xl font-light tracking-wide mb-3 text-green-700">Email Verified</h2>
            <p className="text-sm text-gray-600 mb-8">{message}</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
              <span>Redirecting to login...</span>
            </div>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto mb-8 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <h2 className="text-3xl font-light tracking-wide mb-3 text-red-700">Verification Failed</h2>
            <p className="text-sm text-gray-600 mb-8">{message}</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
              <span>Redirecting to home...</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}