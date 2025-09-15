import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register new user (in real-world apps, restrict to HR/CEO only)
router.post("/register", register);

// Login user
router.post("/login", login);

// Get logged-in user profile
router.get("/me", protect, getMe);

export default router;
