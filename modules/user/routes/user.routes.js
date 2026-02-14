// modules/user/user.routes.js
import { Router } from "express";
import {
  registerUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/user.controller.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";
import upload from "../../../config/multer.config.js";

const router = Router();

// ✅ Register new user
router.post(
  "/register",
  verifyToken,
  upload.fields([{ name: "user_image", maxCount: 1 }]),
  registerUser,
);

// ✅ Update user by ID
router.put(
  "/update/:userid",
  verifyToken,
  upload.fields([{ name: "user_image", maxCount: 1 }]),
  updateUserById,
);

// ✅ Get user by ID
router.get("/:userid", verifyToken, getUserById);

// ✅ Delete user by ID
router.delete("/:userid", verifyToken, deleteUserById);

export default router;
