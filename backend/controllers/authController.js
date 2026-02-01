import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { generateToken } from "../config/jwt.js";

/* =====================================================
   EMAIL HELPER (NON-BLOCKING)
===================================================== */
const sendVerificationEmail = async (email, token) => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const verifyUrl = `http://localhost:5173/verify-email/${token}`;

    const info = await transporter.sendMail({
      from: '"PremiumStore" <no-reply@premiumstore.com>',
      to: email,
      subject: "Verify your PremiumStore account",
      html: `
        <h2>Welcome to PremiumStore</h2>
        <p>Please verify your email to activate your account:</p>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    });

    console.log("📧 Email Preview:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
};

/* =====================================================
   REGISTER USER
===================================================== */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 2️⃣ Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 5️⃣ Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 1000 * 60 * 60, // 1 hour
      profileImage: "",
    });

    // 6️⃣ Respond immediately (IMPORTANT)
    res.status(201).json({
      message: "Account created successfully. Please verify your email.",
    });

    // 7️⃣ Send email in background (NON-BLOCKING)
    sendVerificationEmail(user.email, verificationToken);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* =====================================================
   LOGIN USER
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Block unverified users
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
      });
    }

    // 4️⃣ Success
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =====================================================
   VERIFY EMAIL
===================================================== */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ message: "Email verification failed" });
  }
};

/* =====================================================
   ADMIN LOGIN
===================================================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Admin access only" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Admin login failed" });
  }
};
