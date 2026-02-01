import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
   getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/userController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { deleteUserAccount,uploadProfilePicture } from "../controllers/userController.js";


const router = express.Router();

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
  router.delete("/profile", protect, deleteUserAccount);
  router.post(
  "/profile/image",
  protect,
  upload.single("image"),
  uploadProfilePicture
);

/* ================= ADDRESS ROUTES ================= */
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.delete("/addresses/:id", protect, deleteAddress);
router.put("/addresses/:id/default", protect, setDefaultAddress);



export default router;
