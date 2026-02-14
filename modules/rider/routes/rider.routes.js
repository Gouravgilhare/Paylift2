import { Router } from "express";
import upload from "../../../config/multer.config.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";

import {
  getRiderById,
  getRiderByUserId,
  createRider,
  updateRider,
  deleteRider,
} from "../controllers/rider.controller.js";

const router = Router();

// ✅ Specific routes first (avoid conflicts)
router.get("/user/:userid", verifyToken, getRiderByUserId);
router.get("/:riderid", verifyToken, getRiderById);

// ✅ Register rider (DL image upload)
router.post(
  "/register",
  verifyToken,
  upload.fields([{ name: "dl_image", maxCount: 1 }]),
  createRider,
);

// ✅ Update rider (DL image optional)
router.put(
  "/update/:riderid",
  verifyToken,
  upload.fields([{ name: "dl_image", maxCount: 1 }]),
  updateRider,
);

router.delete("/delete/:riderid", verifyToken, deleteRider);

export default router;
