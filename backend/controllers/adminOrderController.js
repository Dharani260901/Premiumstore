import Order from "../models/Order.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";

/* ================= GET ALL ORDERS ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "_id name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatus = async (req, res) => {
  try {

    const orderId = req.params.id;
    const status = req.body.status?.toLowerCase();

    console.log("Updating Order:", orderId);
    console.log("New Status:", status);

    /* ===== VALIDATE ORDER ID ===== */
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    /* ===== VALIDATE STATUS ===== */
    const allowedStatuses = [
      "placed",
      "shipped",
      "delivered",
      "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    /* ===== FIND ORDER ===== */
    const order = await Order.findById(orderId).populate(
      "user",
      "email name"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    /* ===== UPDATE STATUS ===== */
    order.status = status;

    /* ===== UPDATE STATUS HISTORY ===== */
    order.statusHistory.push({
      status,
      date: new Date(),
    });

    /* ===== COD PAYMENT LOGIC ===== */
    if (order.paymentMethod === "COD" && status === "delivered") {
      order.paymentStatus = "paid";
      order.deliveredAt = new Date();
    }

    /* ===== ONLINE PAYMENT LOGIC ===== */
    if (order.paymentMethod === "ONLINE") {
      order.paymentStatus = "paid";
    }

    /* ===== SAVE ORDER ===== */
    const updatedOrder = await order.save();

    /* ===== OPTIONAL EMAIL NOTIFICATION ===== */
    try {
      if (order.user?.email) {
        await sendEmail({
          to: order.user.email,
          subject: "Order Status Updated",
          text: `Hello ${order.user.name}, your order #${order.displayOrderId} status is now "${status}".`,
        });
      }
    } catch (emailError) {
      console.warn("Email send failed:", emailError.message);
    }

    res.json(updatedOrder);

  } catch (error) {

    console.error("ORDER UPDATE ERROR:", error);

    res.status(500).json({
      message: "Order status update failed",
      error: error.message,
    });
  }
};


/* ================= DELETE ORDER ================= */
export const deleteOrder = async (req, res) => {
  try {

    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await order.deleteOne();

    res.json({
      message: "Order deleted successfully",
    });

  } catch (error) {

    console.error("DELETE ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to delete order",
    });
  }
};