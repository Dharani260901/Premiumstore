import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-light tracking-tight text-gray-900 hover:text-amber-700 transition-colors inline-block mb-4">
              Premium<span className="font-serif italic">Store</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Curated collections that embody timeless style and uncompromising quality.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <SocialLink href="#" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-4">Shop</h3>
            <ul className="space-y-3">
              <FooterLink to="/products?category=Men">Men's Collection</FooterLink>
              <FooterLink to="/products?category=Women">Women's Collection</FooterLink>
              <FooterLink to="/products?category=Girls">Girls' Collection</FooterLink>
              <FooterLink to="/products?category=Boys">Boys' Collection</FooterLink>
              <FooterLink to="/products">All Products</FooterLink>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/shipping">Shipping Information</FooterLink>
              <FooterLink to="/returns">Returns & Exchanges</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/track-order">Track Order</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-200 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-2">Stay Connected</h3>
            <p className="text-sm text-gray-500 mb-4">Subscribe to receive updates on new arrivals and exclusive offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 bg-white border border-slate-200 focus:border-amber-700 focus:outline-none text-sm"
              />
              <button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 text-sm tracking-wide transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} PremiumStore. All rights reserved.
          </p>
          
          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">We accept:</span>
            <div className="flex gap-2">
              <PaymentIcon>Visa</PaymentIcon>
              <PaymentIcon>MC</PaymentIcon>
              <PaymentIcon>AMEX</PaymentIcon>
              <PaymentIcon>UPI</PaymentIcon>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================= FOOTER LINK COMPONENT ================= */
function FooterLink({ to, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-sm text-gray-500 hover:text-amber-700 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

/* ================= SOCIAL LINK COMPONENT ================= */
function SocialLink({ href, children, ...props }) {
  return (
    <a
    
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-white border border-slate-200 hover:border-amber-700 hover:text-amber-700 flex items-center justify-center text-gray-600 transition-all"
      {...props}
    >
      {children}
    </a>
  );
}

/* ================= PAYMENT ICON COMPONENT ================= */
function PaymentIcon({ children }) {
  return (
    <div className="w-12 h-8 bg-white border border-slate-200 flex items-center justify-center text-[10px] font-semibold text-gray-500">
      {children}
    </div>
  );
}