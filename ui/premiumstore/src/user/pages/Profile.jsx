import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AddressForm from "../components/AddressForm";

const API = "http://localhost:5000/api";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!user?.token) return;

    axios
      .get(`${API}/users/profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setFormData({
          name: res.data.name,
          email: res.data.email,
          password: "",
        });
      })
      .catch(console.error);
  }, [user?.token]);

  /* ================= IMAGE PREVIEW ================= */
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  /* ================= SUBMIT PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    try {
      // 1️⃣ Update profile text fields
      await axios.put(`${API}/users/profile`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      let profileImage = user.profileImage;

      // 2️⃣ Upload profile image
      if (image) {
        const imgData = new FormData();
        imgData.append("image", image);

        const imgRes = await axios.post(`${API}/users/profile/image`, imgData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        profileImage = imgRes.data.profileImage;
      }

      // 3️⃣ Update AuthContext
      updateUser({
        name: formData.name,
        email: formData.email,
        profileImage,
      });

      // 4️⃣ Success animation
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  /* ================= DELETE ACCOUNT ================= */
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;

    try {
      await axios.delete(`${API}/users/profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      logout();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

   const addAddress = async (data) => {
    const res = await axios.post(
      `${API}/users/addresses`,
      data,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    setAddresses(res.data);
    setShowForm(false);
  };

  const deleteAddress = async (id) => {
    const res = await axios.delete(
      `${API}/users/addresses/${id}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    setAddresses(res.data);
  };

  const setDefault = async (id) => {
    const res = await axios.put(
      `${API}/users/addresses/${id}/default`,
      {},
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    setAddresses(res.data);
  };


  /* ================= LOAD ADDRESSES ================= */
useEffect(() => {
  if (!user?.token) return;

  axios
    .get(`${API}/users/addresses`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    .then((res) => setAddresses(res.data))
    .catch(console.error);
}, [user?.token]);

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">
            Account Settings
          </p>
          <h1 className="text-4xl font-light tracking-tight">Profile</h1>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4">
            <svg
              className="w-5 h-5 text-green-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm">Profile updated successfully</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-slate-50 border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* PROFILE IMAGE SECTION */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">
                Profile Photo
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={
                      preview ||
                      (user?.profileImage
                        ? user.profileImage.startsWith("http")
                          ? user.profileImage
                          : `http://localhost:5000${user.profileImage}`
                        : "/avatar.png")
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                  />
                </div>

                <div>
                  <label className="inline-block cursor-pointer text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors mb-2">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </label>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">
                Personal Information
              </h3>

              {/* NAME */}
              <div className="mb-6">
                <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="mb-6">
                <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs tracking-wider uppercase text-gray-600 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none transition-colors text-sm"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500 mt-2">
                  Minimum 8 characters recommended
                </p>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="border-t border-slate-200 pt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-sm tracking-wide transition-all duration-300 ${
                  loading
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-amber-700 hover:bg-amber-800"
                } text-white`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Changes...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ================= SAVED ADDRESSES ================= */}
<div className="mt-12 bg-slate-50 border border-slate-100 p-8">
  <h3 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-6">
    Saved Addresses
  </h3>

  {addresses.length === 0 && !showForm && (
    <p className="text-sm text-gray-500 mb-6">
      You haven’t added any addresses yet.
    </p>
  )}

  <div className="space-y-4 mb-6">
    {addresses.map((addr) => (
      <div
        key={addr._id}
        className="bg-white border border-slate-200 p-4 flex justify-between items-start"
      >
        <div>
          <p className="font-medium text-sm">{addr.fullName}</p>
          <p className="text-sm text-gray-600">
            {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
          </p>
          <p className="text-sm text-gray-600">📞 {addr.phone}</p>

          {addr.isDefault && (
            <span className="inline-block mt-2 text-xs text-amber-700 border border-amber-200 px-2 py-1">
              Default Address
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 text-right">
          {!addr.isDefault && (
            <button
              onClick={() => setDefault(addr._id)}
              className="text-xs text-amber-700 hover:underline"
            >
              Set Default
            </button>
          )}

          <button
            onClick={() => deleteAddress(addr._id)}
            className="text-xs text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

  {showForm ? (
    <AddressForm
      onSave={addAddress}
      onCancel={() => setShowForm(false)}
    />
  ) : (
    <button
      onClick={() => setShowForm(true)}
      className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 text-sm tracking-wide transition-colors"
    >
      Add New Address
    </button>
  )}
</div>


        {/* DANGER ZONE */}
        <div className="mt-12 bg-red-50 border border-red-200 p-8">
          <h3 className="text-xs tracking-[0.2em] uppercase text-red-600 mb-4">
            Danger Zone
          </h3>
          <p className="text-sm text-gray-700 mb-6">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            type="button"
            onClick={deleteAccount}
            className="border border-red-500 hover:bg-red-500 text-red-600 hover:text-white py-3 px-8 text-sm tracking-wide transition-all duration-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
