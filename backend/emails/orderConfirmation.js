export const orderConfirmationTemplate = (order, user) => {
  const etaDate = new Date(order.estimatedDeliveryDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Hello ${user.name}, 👋</h2>

      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>

      <hr />

      <h3>📦 Delivery Information</h3>
      <p>
        <strong>Estimated Delivery:</strong><br/>
        ${etaDate} (within ${order.estimatedDeliveryDays} days)
      </p>

      <h3>🏠 Shipping Address</h3>
      <p>
        ${order.shippingAddress.fullName}<br/>
        ${order.shippingAddress.street},<br/>
        ${order.shippingAddress.city},
        ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
        📞 ${order.shippingAddress.phone}
      </p>

      <h3>🛒 Order Items</h3>
      <ul>
        ${order.items
          .map(
            (item) =>
              `<li>${item.name} × ${item.qty} — ₹${item.price}</li>`
          )
          .join("")}
      </ul>

      <h2>Total Amount: ₹${order.total}</h2>

      <p>
        ${
          order.paymentMethod === "COD"
            ? "💵 Payment will be collected on delivery."
            : "✅ Your payment was successful."
        }
      </p>

      <p style="margin-top: 20px;">
        We’ll notify you when your order status changes.
      </p>

      <hr />
      <small>This is an automated email sent using Ethereal Mail.</small>
    </div>
  `;
};
