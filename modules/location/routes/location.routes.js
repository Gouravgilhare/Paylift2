import { Router } from "express";
import { locationController } from "../controllers/location.controller.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";

const router = Router();

// LIVE LOCATION
router.post("/live/update", verifyToken, locationController.updateLiveLocation);
router.get(
  "/live/:entity_type/:entity_id",
  verifyToken,
  locationController.getLiveLocation
);

// TRIP HISTORY
router.post("/history/add", verifyToken, locationController.addTripHistory);
router.get("/history/:trip_id", verifyToken, locationController.getTripHistory);

export default router;
