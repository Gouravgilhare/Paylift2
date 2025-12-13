import express from "express";
import {
  sendOtp,
  verifyOtp,
  refreshAccessToken,
  logout,
} from "../controller/auth.controller.js";

import {
  errorHandler,
  AppError,
  asyncHandler,
} from "../../../middleware/error.handler.js";
import { verifyToken as authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Authentication routes
router.post("/send-otp", asyncHandler(sendOtp));
router.post("/verify-otp", asyncHandler(verifyOtp));

// Token routes
router.post("/refresh-token", asyncHandler(refreshAccessToken));

// Logout
router.post("/logout", authMiddleware, logout);

export default router;
