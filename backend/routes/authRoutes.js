import express from "express";
import { login, register, verifyEmail, adminLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify/:token", verifyEmail);

// ✅ ADMIN LOGIN
router.post("/admin/login", adminLogin);

export default router;
