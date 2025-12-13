import { Router } from "express";
import { vehicleController } from "../controllers/vehicle.controller.js";
import upload from "../../../config/multer.config.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  verifyToken,
  upload.fields([
    { name: "vehicle_image", maxCount: 1 },
    { name: "rc_image", maxCount: 1 },
  ]),
  vehicleController.createVehicle
);

router.get("/:vehicleId", verifyToken, vehicleController.getVehicle);

router.get("/rider/:riderId", verifyToken, vehicleController.getRiderVehicles);

router.put(
  "/update/:vehicleId",
  verifyToken,
  upload.fields([
    { name: "vehicle_image", maxCount: 1 },
    { name: "rc_image", maxCount: 1 },
  ]),
  vehicleController.updateVehicle
);

router.delete(
  "/delete/:vehicleId",
  verifyToken,
  vehicleController.deleteVehicle
);

export default router;
