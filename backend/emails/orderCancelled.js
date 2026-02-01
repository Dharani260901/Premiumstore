export const orderCancelledTemplate = (order, user) => {
  return `
    <h2>Order Cancelled</h2>

    <p>Hi ${user.name},</p>

    <p>Your order <strong>#${order._id
      .slice(-8)
      .toUpperCase()}</strong> has been cancelled.</p>

    ${
      order.paymentMethod === "ONLINE"
        ? `<p>If payment was made online, the refund will be processed shortly.</p>`
        : `<p>No payment was collected for this order.</p>`
    }

    <p>If you have any questions, feel free to contact our support team.</p>

    <br />
    <p>– PremiumStore Team</p>
  `;
};
