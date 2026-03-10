import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/adminOrderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ===== PROTECT ALL ADMIN ORDER ROUTES ===== */
router.use(protect, adminOnly);

/* ================= GET ALL ORDERS ================= */
router.get("/", getAllOrders);

/* ================= UPDATE ORDER STATUS ================= */
router.put("/:id/status", updateOrderStatus);

/* ================= DELETE ORDER ================= */
router.delete("/:id", deleteOrder);

export default router;