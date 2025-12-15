import * as adminService from "../services/admin.service.js";
import jwt from "jsonwebtoken";
import "../../../config/env.config.js";

/* ===========================================================
   ADMIN DASHBOARD & DATA CONTROLLERS
   - All routes assume verifyToken middleware has attached req.user
   - req.user = { adminId, email, role }
=========================================================== */

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// Get all riders
export const getAllRiders = async (req, res, next) => {
  try {
    const riders = await adminService.getAllRiders();
    res.status(200).json({ success: true, data: riders });
  } catch (err) {
    next(err);
  }
};

// Get all vehicles
export const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await adminService.getAllVehicles();
    res.status(200).json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

// Get all trips
export const getAllTrips = async (req, res, next) => {
  try {
    const trips = await adminService.getAllTrips();
    res.status(200).json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
};

// Dashboard statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

/* ===========================================================
   OPTIONAL: Generate JWT for testing (remove in production)
=========================================================== */
export const generateTestToken = (req, res) => {
  const token = jwt.sign(
    {
      adminId: 1,
      email: "admin@paylift.com",
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  res.json({ success: true, token });
};
