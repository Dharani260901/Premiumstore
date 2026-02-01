import "./invoice.css";

export default function InvoiceTemplate({ order }) {
  return (
    <div id="invoice" className="invoice-container">

      {/* HEADER */}
      <div className="invoice-header">
        
        {/* TEXT LOGO */}
        <div className="invoice-text-logo">
          <span className="logo-main">Premium</span>
          <span className="logo-accent">Store</span>
        </div>

        <div className="invoice-title">
          <h1>INVOICE</h1>
          <p>Invoice #: {order._id.slice(-8).toUpperCase()}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
        </div>
      </div>

      {/* COMPANY INFO */}
      <div className="invoice-company">
        <p className="company-name">PremiumStore</p>
        <p>Chennai, Tamil Nadu</p>
        <p>support@premiumstore.com</p>
      </div>

      {/* CUSTOMER INFO */}
      <div className="invoice-section">
        <h3>Bill To</h3>
        <p><strong>{order.shippingAddress.fullName}</strong></p>
        <p>{order.shippingAddress.street}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
          {order.shippingAddress.pincode}
        </p>
        <p>📞 {order.shippingAddress.phone}</p>
      </div>

      {/* ITEMS TABLE */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>₹{item.price}</td>
              <td>₹{item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAL */}
      <div className="invoice-total">
        <p>Total Amount</p>
        <h2>₹{order.total}</h2>
      </div>

      {/* PAYMENT INFO */}
      <div className="invoice-section">
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p>
          <strong>Payment Status:</strong>{" "}
          {order.paymentStatus === "paid" ? "Paid" : "Pending"}
        </p>
      </div>

      {/* FOOTER */}
      <div className="invoice-footer">
        <p>Thank you for shopping with PremiumStore ❤️</p>
        <p>This is a system generated invoice.</p>
      </div>
    </div>
  );
}
import "./invoice.css";

export default function InvoiceTemplate({ order }) {
  return (
    <div id="invoice" className="invoice-container">
      
      {/* HEADER */}
      <div className="invoice-header">
        <div>
          <img src="/logo.png" alt="Company Logo" className="invoice-logo" />
        </div>
        <div className="invoice-title">
          <h1>INVOICE</h1>
          <p>Invoice #: {order._id.slice(-8).toUpperCase()}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
        </div>
      </div>

      {/* COMPANY INFO */}
      <div className="invoice-company">
        <p className="company-name">PremiumStore</p>
        <p>Chennai, Tamil Nadu</p>
        <p>support@premiumstore.com</p>
      </div>

      {/* CUSTOMER INFO */}
      <div className="invoice-section">
        <h3>Bill To</h3>
        <p><strong>{order.shippingAddress.fullName}</strong></p>
        <p>{order.shippingAddress.street}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
          {order.shippingAddress.pincode}
        </p>
        <p>📞 {order.shippingAddress.phone}</p>
      </div>

      {/* ITEMS TABLE */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>₹{item.price}</td>
              <td>₹{item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAL */}
      <div className="invoice-total">
        <p>Total Amount</p>
        <h2>₹{order.total}</h2>
      </div>

      {/* PAYMENT INFO */}
      <div className="invoice-section">
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p>
          <strong>Payment Status:</strong>{" "}
          {order.paymentStatus === "paid" ? "Paid" : "Pending"}
        </p>
      </div>

      {/* FOOTER */}
      <div className="invoice-footer">
        <p>Thank you for shopping with PremiumStore ❤️</p>
        <p>This is a system generated invoice.</p>
      </div>
    </div>
  );
}

import "./invoice.css";

export default function InvoiceTemplate({ order }) {
  return (
    <div id="invoice" className="invoice-container">
      
      {/* HEADER */}
      <div className="invoice-header">
        <div>
          <img src="/logo.png" alt="Company Logo" className="invoice-logo" />
        </div>
        <div className="invoice-title">
          <h1>INVOICE</h1>
          <p>Invoice #: {order._id.slice(-8).toUpperCase()}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
        </div>
      </div>

      {/* COMPANY INFO */}
      <div className="invoice-company">
        <p className="company-name">PremiumStore</p>
        <p>Chennai, Tamil Nadu</p>
        <p>support@premiumstore.com</p>
      </div>

      {/* CUSTOMER INFO */}
      <div className="invoice-section">
        <h3>Bill To</h3>
        <p><strong>{order.shippingAddress.fullName}</strong></p>
        <p>{order.shippingAddress.street}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
          {order.shippingAddress.pincode}
        </p>
        <p>📞 {order.shippingAddress.phone}</p>
      </div>

      {/* ITEMS TABLE */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>₹{item.price}</td>
              <td>₹{item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAL */}
      <div className="invoice-total">
        <p>Total Amount</p>
        <h2>₹{order.total}</h2>
      </div>

      {/* PAYMENT INFO */}
      <div className="invoice-section">
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p>
          <strong>Payment Status:</strong>{" "}
          {order.paymentStatus === "paid" ? "Paid" : "Pending"}
        </p>
      </div>

      {/* FOOTER */}
      <div className="invoice-footer">
        <p>Thank you for shopping with PremiumStore ❤️</p>
        <p>This is a system generated invoice.</p>
      </div>
    </div>
  );
}
