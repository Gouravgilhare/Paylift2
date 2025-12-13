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

router.get("/:riderid", verifyToken, getRiderById);
router.get("/user/:userid", verifyToken, getRiderByUserId);

router.post(
  "/register",
  verifyToken,
  upload.fields([{ name: "dl_image", maxCount: 1 }]),
  createRider
);

router.put(
  "/update/:riderid", 
  verifyToken,
  upload.fields([{ name: "dl_image", maxCount: 1 }]),
  updateRider
);

router.delete("/delete/:riderid", verifyToken, deleteRider);

export default router;
