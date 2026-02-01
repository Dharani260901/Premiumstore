import { useState } from "react";
import axios from "axios";

export default function AdminProductModal({
  isOpen,
  onClose,
  onProductAdded,
  token,
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "men",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onProductAdded(res.data);
      onClose();
      setFormData({
        name: "",
        price: "",
        image: "",
        description: "",
        category: "men",
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 "
      onClick={handleBackdropClick}
    >
     <div className="bg-white w-full max-w-2xl shadow-2xl my-8 animate-fadeIn max-h-[90vh] overflow-y-auto">

        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-light tracking-tight">Add New Product</h2>
            <p className="text-xs text-gray-500 mt-1">Fill in the product details below</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 text-gray-400 hover:text-gray-600 transition-colors rounded"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              <span className="text-sm">{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                </svg>
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                value={formData.name}
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Price and Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                  value={formData.price}
                  required
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm appearance-none cursor-pointer pr-10"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="men">Men's Collection</option>
                    <option value="women">Women's Collection</option>
                    <option value="girls">Girls' Collection</option>
                    <option value="boys">Boys' Collection</option>
                    <option value="shoes">Shoes</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                value={formData.image}
                required
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              {formData.image && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-100">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="h-32 w-auto object-cover border border-slate-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<p class="text-xs text-red-500">Failed to load image</p>';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter product description (optional)"
                rows="4"
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.description.length} characters
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border border-slate-200 hover:border-slate-300 bg-white text-gray-700 py-3 text-sm tracking-wide transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 text-sm tracking-wide transition-all duration-300 ${
                loading
                  ? "bg-amber-400 cursor-not-allowed"
                  : "bg-amber-700 hover:bg-amber-800"
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Product...
                </span>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}