export const orderShippedTemplate = (order, user) => {
  return `
    <h2>Your order is on the way 🚚</h2>

    <p>Hi ${user.name},</p>

    <p>Your order <strong>#${order._id
      .slice(-8)
      .toUpperCase()}</strong> has been shipped.</p>

    <p><strong>Estimated Delivery:</strong> ${
      order.estimatedDeliveryDate
        ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Soon"
    }</p>

    <p>We’ll notify you once it’s delivered.</p>

    <br />
    <p>– PremiumStore Team</p>
  `;
};
