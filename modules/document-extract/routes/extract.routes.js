import { Router } from "express";
import upload from "../../../config/multer.config.js";
import { extractController } from "../controller/extract.controller.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";

const router = Router();

// 🔹 Insurance PDF
router.post(
  "/insurance",
  verifyToken,
  upload.single("document"),
  extractController.extractInsuranceFromPDF
);

// 🔹 RC Card Image
router.post(
  "/rc-card",
  verifyToken,
  upload.single("document"),
  extractController.extractRCFromImage
);

// 🔹 Number Plate Image
router.post(
  "/number-plate",
  verifyToken,
  upload.single("document"),
  extractController.extractNumberPlate
);

export default router;
