import express from "express";
import { addInquiry, getAllInquiry, getMyInquiry, updateInquiryStatus } from "../controllers/inquiry.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // your JWT auth middleware
import admin from "../middlewares/admin.middleware.js";

const router = express.Router();

// User adds feedback
router.post("/add", protect, addInquiry);

// Admin gets all feedback (add admin middleware if needed)
router.get("/all", admin, getAllInquiry);

router.put("/update-status/:id",admin, updateInquiryStatus); // add admin middleware if needed

// User sees their own feedback
router.get("/my", protect, getMyInquiry);

export default router;
