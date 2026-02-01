import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../controllers/adminOrderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

// ADMIN gets all orders
router.get("/", getAllOrders);

// ADMIN updates status
router.put("/:id/status", updateOrderStatus);

// ADMIN deletes order (optional)
router.delete("/:id", deleteOrder);

export default router;
