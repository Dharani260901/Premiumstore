import { useEffect, useState } from "react";
import axios from "axios";
import AddProductModal from "../components/AdminProductModal";

export default function AdminProducts() {
// 🔥 CHANGED: admin instead of user
  const admin = JSON.parse(localStorage.getItem("admin"));
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/products/${id}`,
        {
          headers: { Authorization: `Bearer ${admin.token}` }
        }
      );

      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">Inventory Management</p>
          <h1 className="text-3xl font-light tracking-tight">Products</h1>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 text-sm tracking-wide transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-100 p-6">
          <p className="text-xs tracking-wider uppercase text-gray-400 mb-2">Total Products</p>
          <p className="text-3xl font-light">{products.length}</p>
        </div>
        <div className="bg-white border border-slate-100 p-6">
          <p className="text-xs tracking-wider uppercase text-gray-400 mb-2">Categories</p>
          <p className="text-3xl font-light">{new Set(products.map(p => p.category)).size}</p>
        </div>
        <div className="bg-white border border-slate-100 p-6">
          <p className="text-xs tracking-wider uppercase text-gray-400 mb-2">Avg. Price</p>
          <p className="text-3xl font-light">
            ₹{products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0}
          </p>
        </div>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <h3 className="text-2xl font-light tracking-wide mb-3">No Products Yet</h3>
          <p className="text-sm text-gray-500 mb-8">Start building your inventory by adding your first product</p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 text-sm tracking-wide transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Add First Product
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs tracking-wider uppercase text-gray-600 font-medium">Product</th>
                  <th className="text-left px-6 py-4 text-xs tracking-wider uppercase text-gray-600 font-medium">Category</th>
                  <th className="text-left px-6 py-4 text-xs tracking-wider uppercase text-gray-600 font-medium">Price</th>
                  <th className="text-right px-6 py-4 text-xs tracking-wider uppercase text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="w-16 h-16 object-cover border border-slate-100" 
                        />
                        <div>
                          <p className="font-medium text-sm">{p.name}</p>
                          <p className="text-xs text-gray-500 mt-1">ID: {p._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-slate-50 border border-slate-100 text-xs tracking-wider uppercase text-gray-600">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">₹{p.price}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removeProduct(p._id)}
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddProductModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onProductAdded={(p) => setProducts([p, ...products])}
        token={admin.token}
      />
    </div>
  );
}