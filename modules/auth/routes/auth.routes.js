import express from "express";
import {
  sendOtp,
  verifyOtp,
  refreshAccessToken,
  logout,

  // ADMIN
  sendAdminOtp,
  verifyAdminOtp,
  adminRefreshToken,
  adminLogout,
} from "../controller/auth.controller.js";

import { asyncHandler } from "../../../middleware/error.handler.js";
import { verifyToken as authMiddleware } from "../middleware/auth.middleware.js";

module.exports = router;
const authController = require("../controllers/auth.controller");

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

// Token routes
router.post("/refresh-token", asyncHandler(refreshAccessToken));
router.post("/logout", authMiddleware, asyncHandler(logout));

/* ============================
   ADMIN AUTH (OTP BASED)
============================ */
router.post("/admin/send-otp", asyncHandler(sendAdminOtp));
router.post("/admin/verify-otp", asyncHandler(verifyAdminOtp));
router.post("/admin/refresh-token", asyncHandler(adminRefreshToken));
router.post("/admin/logout", asyncHandler(adminLogout));

export default router;
