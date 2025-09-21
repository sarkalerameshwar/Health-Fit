import express from "express";
import {
  signup,
  login,
  verifyOtp,
  forgotPassword,
  verifyResetPasswordOtp,
  resendResetPasswordOtp,
} from "../controllers/user.controller.js";

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

export default router;
