import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ➕ Add product
router.post("/", protect, adminOnly, async (req, res) => {
  const product = await Product.create({
    ...req.body,
    category: req.body.category.toLowerCase()
  });
  res.status(201).json(product);
});



// ❌ Delete product
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product removed" });
});

export default router;
