export const orderPlacedTemplate = (order, user) => {
  const orderId = order._id.toString().slice(-8).toUpperCase();

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hi ${user.name},</h2>

      <p>
        Your order <strong>#${orderId}</strong> has been placed successfully.
      </p>

      <p>
        <strong>Payment Method:</strong> ${order.paymentMethod}
      </p>

      <p>
        <strong>Total Amount:</strong> ₹${order.total}
      </p>

      ${
        order.estimatedDeliveryDate
          ? `<p>
              <strong>Estimated Delivery:</strong>
              ${new Date(order.estimatedDeliveryDate).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </p>`
          : ""
      }

      <p>
        We’ll notify you when your order is shipped 🚚
      </p>

      <p>Thank you for shopping with <strong>PremiumStore</strong> ❤️</p>
    </div>
  `;
};
