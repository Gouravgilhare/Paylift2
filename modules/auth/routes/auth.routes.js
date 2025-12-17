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

module.exports = router;
const authController = require("../controllers/auth.controller");

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

// Token routes
router.post("/refresh-token", asyncHandler(refreshAccessToken));

// Logout
router.post("/logout", authMiddleware, logout);

export default router;
