import Order from "../models/Order.js";
import { sendEmail } from "../utils/sendEmail.js";

// 📧 Email templates
import { orderPlacedTemplate } from "../emails/orderPlaced.js";
import { orderShippedTemplate } from "../emails/orderShipped.js";
import { orderDeliveredTemplate } from "../emails/orderDelivered.js";
import { orderCancelledTemplate } from "../emails/orderCancelled.js";

// 📦 ETA logic (single source of truth)
import { calculateETA } from "../utils/calculateETA.js";

/* ================= GET USER ORDERS ================= */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================= GET ORDER BY ID ================= */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Security check
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching order details" });
  }
};

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      total,
      paymentMethod,
      transactionId,
      shippingAddress,
    } = req.body;

    /* ===== PAYMENT STATUS ===== */
    let paymentStatus = "pending";
    if (paymentMethod === "ONLINE") {
      paymentStatus = "paid";
    }

    /* ===== ETA (SINGLE SOURCE OF TRUTH) ===== */
    const { etaDate, etaDays } = calculateETA(paymentMethod);

    /* ===== CREATE ORDER ===== */
    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      paymentMethod,
      paymentStatus,
      transactionId,
      shippingAddress,

      status: "Placed",
      statusHistory: [{ status: "Placed", date: new Date() }],

      // 📦 ETA fields
      estimatedDeliveryDays: etaDays,
      estimatedDeliveryDate: etaDate,
    });

    /* ===== EMAIL: ORDER PLACED ===== */
    await sendEmail({
      to: req.user.email,
      subject:
        paymentMethod === "COD"
          ? "Order placed – Pay on delivery"
          : "Payment successful – Order confirmed",
      html: orderPlacedTemplate(order, req.user),
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* ================= UPDATE ORDER STATUS (ADMIN) ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    let { status } = req.body;

    // Normalize
    status = status.toLowerCase();

    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.status.toLowerCase();

    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      date: new Date(),
    });

    // 💰 COD auto-payment on delivery
    if (status === "delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
    }

    // 📅 Delivered timestamp
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    /* ================= EMAIL TRIGGERS ================= */

    // 🚚 SHIPPED
    if (previousStatus !== "shipped" && status === "shipped") {
      await sendEmail({
        to: order.user.email,
        subject: "Your order has been shipped 🚚",
        html: orderShippedTemplate(order, order.user),
      });
    }

    // 📦 DELIVERED (ONLINE + COD)
    if (previousStatus !== "delivered" && status === "delivered") {
      await sendEmail({
        to: order.user.email,
        subject:
          order.paymentMethod === "COD"
            ? "Order delivered & payment received 🎉"
            : "Your order has been delivered 🎉",
        html: orderDeliveredTemplate(order, order.user),
      });
    }

    // ❌ CANCELLED
    if (previousStatus !== "cancelled" && status === "cancelled") {
      await sendEmail({
        to: order.user.email,
        subject: "Your order has been cancelled",
        html: orderCancelledTemplate(order, order.user),
      });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
