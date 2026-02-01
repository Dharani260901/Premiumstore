import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import html2pdf from "html2pdf.js";

const API = "http://localhost:5000/api";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!user?.token) return;

    axios
      .get(`${API}/orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/orders");
      });
  }, [id, user?.token, navigate]);

  const downloadInvoice = async () => {
  if (!order || downloading) return;

  setDownloading(true);
  const element = document.getElementById("invoice-pdf");

  if (!element) {
    setDownloading(false);
    return;
  }

  try {
    await html2pdf()
      .set({
        margin: 15,
        filename: `Invoice_${order._id.slice(-8).toUpperCase()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },

        // 🔥 THIS IS THE FIX
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",

          onclone: (clonedDoc) => {
            const style = clonedDoc.createElement("style");
            style.innerHTML = `
              * {
                color: #111827 !important;
                background-color: #ffffff !important;
                border-color: #e5e7eb !important;
              }

              .bg-amber-50,
              .bg-slate-50,
              .bg-green-50,
              .bg-orange-50 {
                background-color: #ffffff !important;
              }

              .text-amber-700,
              .text-green-700,
              .text-orange-700 {
                color: #111827 !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          },
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    setDownloading(false);
  }
};


  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const isCOD = order.paymentMethod === "COD";
  const isPaid = order.paymentStatus === "paid";

  const etaDate = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-slate-50 min-h-screen px-6 py-12 print:bg-white print:p-0">
      {/* ACTION BAR (HIDDEN IN PRINT) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Order
        </button>

        <div className="flex gap-3">
          

          <button
            onClick={downloadInvoice}
            disabled={downloading}
            className={`inline-flex items-center gap-2 px-6 py-3 text-sm tracking-wide transition-all ${
              downloading
                ? "bg-amber-400 cursor-not-allowed"
                : "bg-amber-700 hover:bg-amber-800"
            } text-white`}
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* INVOICE */}
      <div id="invoice-pdf" className="max-w-4xl mx-auto bg-white p-12 border border-slate-200 shadow-sm print:border-0 print:shadow-none print:p-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-12 pb-8 border-b-2 border-slate-200">
          <div>
            <div className="flex items-baseline gap-1 mb-2">
              <h1 className="text-3xl font-light tracking-tight" style={{ color: '#111827' }}>Premium</h1>
              <span className="text-3xl font-serif italic" style={{ color: '#b45309' }}>Store</span>
            </div>
            <p className="text-sm" style={{ color: '#6b7280' }}>Tax Invoice</p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-light tracking-[0.3em] mb-3" style={{ color: '#374151' }}>INVOICE</h2>
            <div className="text-sm space-y-1">
              <p style={{ color: '#4b5563' }}>
                <span className="font-medium">Invoice No:</span>{" "}
                <span className="font-mono">#{order._id.slice(-8).toUpperCase()}</span>
              </p>
              <p style={{ color: '#4b5563' }}>
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* COMPANY & CUSTOMER INFO */}
        <div className="grid grid-cols-2 gap-12 mb-10">
          {/* From */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#9ca3af' }}>From</h3>
            <p className="text-base font-medium mb-1" style={{ color: '#111827' }}>PremiumStore</p>
            <p className="text-sm" style={{ color: '#4b5563' }}>123 Fashion Street</p>
            <p className="text-sm" style={{ color: '#4b5563' }}>Chennai, Tamil Nadu 600001</p>
            <p className="text-sm" style={{ color: '#4b5563' }}>India</p>
            <div className="mt-3 text-sm space-y-1" style={{ color: '#4b5563' }}>
              <p>📧 support@premiumstore.com</p>
              <p>📞 +91 98765 43210</p>
            </div>
          </div>

          {/* Bill To */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#9ca3af' }}>Bill To</h3>
            <p className="text-base font-medium mb-1" style={{ color: '#111827' }}>{order.shippingAddress.fullName}</p>
            <p className="text-sm" style={{ color: '#4b5563' }}>{order.shippingAddress.street}</p>
            <p className="text-sm" style={{ color: '#4b5563' }}>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p className="text-sm" style={{ color: '#4b5563' }}>{order.shippingAddress.pincode}</p>
            <p className="text-sm mt-3" style={{ color: '#4b5563' }}>📞 {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b-2" style={{ borderColor: '#e5e7eb' }}>
              <th className="text-left py-3 text-xs tracking-[0.15em] uppercase font-medium" style={{ color: '#4b5563' }}>
                Item Description
              </th>
              <th className="text-center py-3 text-xs tracking-[0.15em] uppercase font-medium w-20" style={{ color: '#4b5563' }}>
                Qty
              </th>
              <th className="text-right py-3 text-xs tracking-[0.15em] uppercase font-medium w-28" style={{ color: '#4b5563' }}>
                Unit Price
              </th>
              <th className="text-right py-3 text-xs tracking-[0.15em] uppercase font-medium w-32" style={{ color: '#4b5563' }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b" style={{ borderColor: '#f3f4f6' }}>
                <td className="py-4 text-sm" style={{ color: '#374151' }}>{item.name}</td>
                <td className="py-4 text-center text-sm" style={{ color: '#374151' }}>{item.qty}</td>
                <td className="py-4 text-right text-sm" style={{ color: '#374151' }}>
                  ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-4 text-right text-sm font-medium" style={{ color: '#111827' }}>
                  ₹{(item.qty * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SUMMARY */}
        <div className="flex justify-end mb-10">
          <div className="w-80">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: '#4b5563' }}>Subtotal</span>
                <span style={{ color: '#374151' }}>
                  ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#4b5563' }}>Delivery Fee</span>
                <span className="font-medium" style={{ color: '#b45309' }}>Free</span>
              </div>
            </div>
            
            <div className="border-t-2 pt-4" style={{ borderColor: '#e5e7eb' }}>
              <div className="flex justify-between items-baseline">
                <span className="text-sm tracking-[0.15em] uppercase font-medium" style={{ color: '#4b5563' }}>
                  Total Amount
                </span>
                <span className="text-2xl font-light" style={{ color: '#111827' }}>
                  ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DELIVERY ETA */}
        {etaDate && (
          <div className="mb-10 p-6 border" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
            <h3 className="text-xs tracking-[0.2em] uppercase mb-2 font-medium" style={{ color: '#b45309' }}>
              Estimated Delivery
            </h3>

            <p className="text-lg font-light flex items-center gap-2" style={{ color: '#111827' }}>
              <span>📦</span>
              <span>{etaDate}</span>
            </p>

            {order.estimatedDeliveryDays && (
              <p className="text-sm mt-2" style={{ color: '#4b5563' }}>
                Expected within {order.estimatedDeliveryDays} business days from order date
              </p>
            )}
          </div>
        )}

        {/* PAYMENT INFO */}
        <div className="border p-6 mb-10" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
          <h3 className="text-xs tracking-[0.2em] uppercase mb-4 font-medium" style={{ color: '#4b5563' }}>
            Payment Information
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Payment Method</p>
              <p className="font-medium" style={{ color: '#111827' }}>
                {isCOD ? "Cash on Delivery" : "Online Payment"}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Payment Status</p>
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs tracking-wider uppercase font-medium border"
                style={{
                  backgroundColor: isPaid ? '#ecfdf5' : '#fff7ed',
                  color: isPaid ? '#065f46' : '#c2410c',
                  borderColor: isPaid ? '#86efac' : '#fed7aa'
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }}></span>
                {isPaid ? "Paid" : "Pending"}
              </span>
            </div>
            {order.transactionId && (
              <div className="col-span-2 pt-3 border-t" style={{ borderColor: '#e2e8f0' }}>
                <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Transaction ID</p>
                <p className="font-mono text-xs" style={{ color: '#374151' }}>{order.transactionId}</p>
              </div>
            )}
          </div>
          
          {isCOD && !isPaid && (
            <p className="text-xs italic mt-4 pt-4 border-t" style={{ color: '#6b7280', borderColor: '#e2e8f0' }}>
              * Payment of ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} will be collected at the time of delivery.
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center pt-8 border-t-2" style={{ borderColor: '#e5e7eb' }}>
          <p className="text-base font-light mb-2" style={{ color: '#374151' }}>
            Thank you for shopping with PremiumStore
          </p>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>
            This is a computer-generated invoice and does not require a signature.
          </p>
          <p className="text-xs mt-4" style={{ color: '#6b7280' }}>
            For any queries, contact us at support@premiumstore.com | +91 98765 43210
          </p>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:p-8 {
            padding: 2rem !important;
          }
          
          .print\\:border-0 {
            border: 0 !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          #invoice-pdf {
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
          
          table {
            page-break-inside: avoid;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
        }
      `}</style>
    </div>
  );
}