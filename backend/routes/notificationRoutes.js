import express from "express";
import {
  getAdminNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Only admin can see notifications
router.get("/", protect, adminOnly, getAdminNotifications);

// Mark notification as read
router.put("/:id/read", protect, adminOnly, markNotificationRead);

export default router;