import express from "express";
import {
  signup,
  login,
  verifyOtp,
  forgotPassword,
  verifyResetPasswordOtp,
  resendResetPasswordOtp,
  getAllUsers
} from "../controllers/user.controller.js";
import { get } from "http";

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
router.get('/', getAllUsers);

export default router;
