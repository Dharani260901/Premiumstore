import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import Counter from "../models/Counter.js";
import { sendEmail } from "../utils/sendEmail.js";

// 📧 Email templates
import { orderPlacedTemplate } from "../emails/orderPlaced.js";
import { orderShippedTemplate } from "../emails/orderShipped.js";
import { orderDeliveredTemplate } from "../emails/orderDelivered.js";
import { orderCancelledTemplate } from "../emails/orderCancelled.js";

// 📦 ETA logic
import { calculateETA } from "../utils/calculateETA.js";

/* =====================================================
   ORDER NUMBER GENERATOR
===================================================== */
const getNextOrderNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

/* =====================================================
   GET USER ORDERS
===================================================== */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* =====================================================
   GET ORDER BY ID
===================================================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch {
    res.status(500).json({ message: "Server error fetching order details" });
  }
};

/* =====================================================
   CREATE ORDER (USER)
===================================================== */
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      total,
      paymentMethod,
      transactionId,
      shippingAddress,
    } = req.body;

    const paymentStatus = paymentMethod === "ONLINE" ? "paid" : "pending";
    const { etaDate, etaDays } = calculateETA(paymentMethod);
  const orderNumber = await getNextOrderNumber();
const displayOrderId = `ORD${orderNumber}`;



    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      paymentMethod,
      paymentStatus,
      transactionId,
      shippingAddress,
      displayOrderId,

      status: "placed",
      statusHistory: [{ status: "placed", date: new Date() }],

      estimatedDeliveryDays: etaDays,
      estimatedDeliveryDate: etaDate,
    });

    await Notification.create({
  type: "order",
  message: `Order #${order.displayOrderId} placed`,
  orderId: order._id, // ✅ REQUIRED
});


    /* 📧 EMAIL (NON-BLOCKING) */
    sendEmail({
      to: req.user.email,
      subject:
        paymentMethod === "COD"
          ? "Order placed – Pay on delivery"
          : "Payment successful – Order confirmed",
      html: orderPlacedTemplate(order, req.user),
    }).catch(() => {});

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* =====================================================
   UPDATE ORDER STATUS (ADMIN)
===================================================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const status = req.body.status.toLowerCase();
    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.status;

    if (previousStatus === status) {
      return res.json(order); // no change
    }

    order.status = status;
    order.statusHistory.push({ status, date: new Date() });

    if (status === "delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
      order.deliveredAt = new Date();
    }

    await order.save();

    /* 🔔 ADMIN NOTIFICATION (ONLY ONCE) */
    await Notification.create({
      type: "order",
      message: `Order #${order.displayOrderId} ${status}`,
      orderId: order._id,
    });

    /* 📧 EMAIL BASED ON STATUS */
    if (status === "shipped") {
      sendEmail({
        to: order.user.email,
        subject: "Your order has been shipped 🚚",
        html: orderShippedTemplate(order, order.user),
      }).catch(() => {});
    }

    if (status === "delivered") {
      sendEmail({
        to: order.user.email,
        subject:
          order.paymentMethod === "COD"
            ? "Order delivered & payment received 🎉"
            : "Your order has been delivered 🎉",
        html: orderDeliveredTemplate(order, order.user),
      }).catch(() => {});
    }

    if (status === "cancelled") {
      sendEmail({
        to: order.user.email,
        subject: "Your order has been cancelled",
        html: orderCancelledTemplate(order, order.user),
      }).catch(() => {});
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
