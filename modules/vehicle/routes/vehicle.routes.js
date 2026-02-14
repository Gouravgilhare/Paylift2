import { Router } from "express";
import { vehicleController } from "../controllers/vehicle.controller.js";
import upload from "../../../config/multer.config.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";

const router = Router();

// ✅ Vehicle Registration
router.post(
  "/register",
  verifyToken,
  upload.fields([
    { name: "vehicle_image", maxCount: 1 },
    { name: "rc_image", maxCount: 1 },
  ]),
  vehicleController.createVehicle,
);

// ✅ Update Vehicle
router.put(
  "/update/:vehicleId",
  verifyToken,
  upload.fields([
    { name: "vehicle_image", maxCount: 1 },
    { name: "rc_image", maxCount: 1 },
  ]),
  vehicleController.updateVehicle,
);

// ✅ Get Vehicles by Rider (specific route FIRST)
router.get("/rider/:riderId", verifyToken, vehicleController.getRiderVehicles);

// ✅ Get Vehicle by ID (dynamic route AFTER specific routes)
router.get("/:vehicleId", verifyToken, vehicleController.getVehiclePricingById);

// ✅ Delete Vehicle
router.delete(
  "/delete/:vehicleId",
  verifyToken,
  vehicleController.deleteVehicle,
);

// ------------------ Pricing Routes ------------------

router.post(
  "/pricing/create",
  verifyToken,
  vehicleController.createVehiclePricing,
);

router.get("/pricing/all", vehicleController.getAllVehiclePricing);

router.get("/pricing/id/:id", vehicleController.getVehiclePricingById);

router.get(
  "/pricing/category/:category",
  vehicleController.getVehiclePricingByCategory,
);

router.put(
  "/pricing/update/id/:id",
  verifyToken,
  vehicleController.updateVehiclePricingById,
);

router.put(
  "/pricing/update/category/:category",
  verifyToken,
  vehicleController.updateVehiclePricingByCategory,
);

router.delete(
  "/pricing/delete/:id",
  verifyToken,
  vehicleController.deleteVehiclePricing,
);

router.get("/pricing/stats", vehicleController.getPricingStats);

export default router;
