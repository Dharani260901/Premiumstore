import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminOrderRoutes from './routes/adminOrderRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"
import path from "path";
import { fileURLToPath } from "url";




dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


/* ===================== DATABASE ===================== */
connectDB();
/* ===================== ROUTES ===================== */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);



/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.send("🚀 PremiumStore API is running");
});

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
