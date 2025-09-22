import express from "express";
import { addInquiry, getAllInquiry, getMyInquiry, updateInquiryStatus } from "../controllers/inquiry.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // your JWT auth middleware

const router = express.Router();

// User adds feedback
router.post("/add", protect, addInquiry);

// Admin gets all feedback (add admin middleware if needed)
router.get("/all", getAllInquiry);

router.put("/update-status/:id", updateInquiryStatus); // add admin middleware if needed

// User sees their own feedback
router.get("/my", protect, getMyInquiry);

export default router;
