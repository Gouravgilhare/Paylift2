// modules/location/routes/maps.routes.js
import express from "express";
import * as mapsController from "../controllers/maps.controller.js";

const router = express.Router();

router.post("/route", mapsController.getRoute);
router.post("/distance-matrix", mapsController.getDistanceMatrix);
router.get("/places/autocomplete", mapsController.placeAutocomplete);
router.get("/places/details", mapsController.getPlaceDetails);

export default router;
