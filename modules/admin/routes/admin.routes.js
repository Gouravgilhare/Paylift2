import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import * as logsController from "../controllers/logs.controller.js";
import {
  adminRefreshToken,
  adminLogout,
  sendAdminOtp,
  verifyAdminOtp,
} from "../../auth/controller/auth.controller.js"; // admin auth controllers
import { verifyToken } from "../../auth/middleware/auth.middleware.js"; // JWT middleware

const router = express.Router();

/* ============================
//    ADMIN AUTH ROUTES (PUBLIC)
============================ */
router.post("/send-otp", sendAdminOtp); // Send OTP
router.post("/verify-otp", verifyAdminOtp); // Verify OTP & get JWT
router.post("/refresh-token", adminRefreshToken); // Refresh access token
router.post("/logout", adminLogout); // Logout (requires JWT in header)
// router.put("/update/pricing",)
/* ============================
   ADMIN PROTECTED ROUTES
============================ */

// Middleware: JWT verification
router.use(verifyToken);

// Middleware: Only admins allowed
const adminOnly = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.role !== "superadmin")
  ) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Admins only" });
  }
  next();
};
router.use(adminOnly);

// Users
router.get("/users", adminController.getAllUsers);

// Riders
router.get("/riders", adminController.getAllRiders);

// Vehicles
router.get("/vehicles", adminController.getAllVehicles);

// Trips
router.get("/trips", adminController.getAllTrips);

// Dashboard Stats
router.get("/dashboard", adminController.getDashboardStats);

// Logs Management
router.get("/logs", logsController.getLogFilesList); // Get list of log files
router.get("/logs/recent/:type", logsController.getRecentLogsByType); // Get recent logs by type
router.get("/logs/:filename", logsController.getLogsByFilename); // Get logs from specific file
router.delete("/logs/:filename", logsController.clearLogFile); // Clear log file (superadmin only)

export default router;
