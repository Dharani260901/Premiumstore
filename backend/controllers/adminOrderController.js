import Order from "../models/Order.js";
import { sendEmail } from "../utils/sendEmail.js";

/* ================= GET ALL ORDERS ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "_id name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    // ✅ COD → mark PAID only when Delivered
    if (order.paymentMethod === "COD" && status === "Delivered") {
      order.paymentStatus = "paid";
    }

    // ✅ ONLINE → always paid
    if (order.paymentMethod === "ONLINE") {
      order.paymentStatus = "paid";
    }

    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= DELETE ORDER (OPTIONAL) ================= */
export const deleteOrder = async (req, res) => {
  res.json({ message: "Delete order logic here" });
};
