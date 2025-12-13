import { Router } from "express";
import { tripController } from "../controllers/trip.controller.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";

const router = Router();

// USER REQUESTS A TRIP
router.post("/register", verifyToken, tripController.createTrip);

// GET TRIP DETAILS
router.get("/:tripId", verifyToken, tripController.getTripById);

// RIDER ACCEPTS TRIP
router.put("/assign/:tripId", verifyToken, tripController.assignRider);

// START TRIP
router.put("/start/:tripId", verifyToken, tripController.startTrip);

// UPDATE DISTANCE + TIME (background tracking)
router.put(
  "/update/:tripId",
  verifyToken,
  tripController.updateDistanceAndTime
);

// COMPLETE TRIP
router.put("/complete/:tripId", verifyToken, tripController.completeTrip);

// CANCEL TRIP
router.put("/cancel/:tripId", verifyToken, tripController.cancelTrip);

export default router;
