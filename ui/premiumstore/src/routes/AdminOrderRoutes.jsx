import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { getAllOrders, updateOrderStatus } from "../controllers/adminOrderController.js";

const router = express.Router();

// ✅ UPDATED: protect + adminOnly
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);

export default router;
