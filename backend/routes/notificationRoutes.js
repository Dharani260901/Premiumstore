import express from "express";
import {
  getAdminNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAdminNotifications);
router.put("/:id/read", protect, markNotificationRead);

export default router;
