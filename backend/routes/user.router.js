import express from "express";
import {
  signup,
  login,
  verifyOtp,
  forgotPassword,
  verifyResetPasswordOtp,
  resendResetPasswordOtp,
  getAllUsers,
  getUserById
} from "../controllers/user.controller.js";
import { get } from "http";
import admin from "../middlewares/admin.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/status", (req, res) => {
  res.send("API is running");
});

// auth routes
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-password-otp', verifyResetPasswordOtp);
router.post('/resend-reset-password-otp', resendResetPasswordOtp);
router.get('/all',admin, getAllUsers);
router.get('/', protect, getUserById);

export default router;
