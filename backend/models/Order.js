import mongoose from "mongoose";

/* ================= ORDER ITEM ================= */
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { _id: false },
);

/* ================= SHIPPING ADDRESS ================= */
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false },
);

/* ================= ORDER SCHEMA ================= */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    transactionId: {
      type: String,
      default: null,
    },

    total: {
      type: Number,
      required: true,
    },
    displayOrderId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    /* ✅ SINGLE SOURCE OF TRUTH (LOWERCASE ENUM) */
    status: {
      type: String,
      enum: ["placed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["placed", "shipped", "delivered", "cancelled"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    deliveredAt: {
      type: Date,
    },

    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },

    estimatedDeliveryDays: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
