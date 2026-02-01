export const orderDeliveredTemplate = (order, user) => {
  return `
    <h2>Order Delivered 🎉</h2>

    <p>Hi ${user.name},</p>

    <p>Your order <strong>#${order._id
      .slice(-8)
      .toUpperCase()}</strong> has been delivered successfully.</p>

    ${
      order.paymentMethod === "COD"
        ? `<p><strong>Payment Status:</strong> Payment received on delivery.</p>`
        : `<p><strong>Payment Status:</strong> Paid</p>`
    }

    <p>We hope you enjoy your purchase!</p>

    <br />
    <p>– PremiumStore Team</p>
  `;
};
