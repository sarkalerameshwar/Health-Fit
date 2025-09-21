import express from "express";
import { addInquiry, getAllInquiry, getMyInquiry } from "../controllers/inquiry.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // your JWT auth middleware

const router = express.Router();

// User adds feedback
router.post("/add", protect, addInquiry);

// Admin gets all feedback (add admin middleware if needed)
router.get("/all", protect, getAllInquiry);

// User sees their own feedback
router.get("/my", protect, getMyInquiry);

export default router;
