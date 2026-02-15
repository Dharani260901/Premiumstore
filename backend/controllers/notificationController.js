import Notification from "../models/Notification.js";

/* =====================================================
   GET ADMIN NOTIFICATIONS
===================================================== */
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* =====================================================
   MARK AS READ
===================================================== */
export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
