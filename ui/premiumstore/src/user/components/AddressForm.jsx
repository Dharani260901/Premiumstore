import { useState } from "react";

export default function AddressForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-100 p-8">
      <div className="mb-6">
        <h3 className="text-lg font-light tracking-wide mb-2">Add New Address</h3>
        <p className="text-sm text-gray-500">Fill in the details below to add a new delivery address</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-4">Personal Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              name="fullName" 
              label="Full Name" 
              placeholder="John Doe"
              onChange={handleChange}
              required
            />
            <Input 
              name="phone" 
              label="Phone Number" 
              type="tel"
              placeholder="+91 98765 43210"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Address Details */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-4">Address Details</p>
          <div className="space-y-6">
            <Input 
              name="street" 
              label="Street Address" 
              placeholder="123 Main Street, Apartment 4B"
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                name="city" 
                label="City" 
                placeholder="Mumbai"
                onChange={handleChange}
                required
              />
              <Input 
                name="state" 
                label="State" 
                placeholder="Maharashtra"
                onChange={handleChange}
                required
              />
              <Input 
                name="pincode" 
                label="PIN Code" 
                placeholder="400001"
                pattern="[0-9]{6}"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t border-slate-200">
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
                Saving...
              </span>
            ) : (
              "Save Address"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-slate-200 hover:border-slate-300 bg-white text-gray-700 py-3 text-sm tracking-wide transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
function Input({ label, name, type = "text", placeholder = "", pattern, onChange, required }) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        pattern={pattern}
        required={required}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
      />
    </div>
  );
}