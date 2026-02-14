import { Router } from "express";
import upload from "../../../config/multer.config.js";
import { extractController } from "../controller/extract.controller.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";

const router = Router();

router.post(
  "/insurance",
  verifyToken,
  upload.single("document"),
  extractController.extractInsuranceFromPDF,
);

router.post(
  "/rc-card",
  verifyToken,
  upload.single("document"),
  extractController.extractRCFromImage,
);

router.post(
  "/number-plate",
  verifyToken,
  upload.single("document"),
  extractController.extractNumberPlate,
);

router.post(
  "/driving-license",
  verifyToken,
  upload.single("document"),
  extractController.extractDLFromImage,
);

export default router;
