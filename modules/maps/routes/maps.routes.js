// modules/location/routes/maps.routes.js
import express from "express";
import * as mapsController from "../controllers/maps.controller.js";
import { verifyToken } from "../../auth/middleware/auth.middleware.js";
const router = express.Router();

router.post("/route", verifyToken, mapsController.getRoute);
router.post("/distance-matrix", verifyToken, mapsController.getDistanceMatrix);
router.get(
  "/places/autocomplete",
  verifyToken,
  mapsController.placeAutocomplete,
);
router.get("/places/details", verifyToken, mapsController.getPlaceDetails);

export default router;
