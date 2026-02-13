// modules/location/controllers/maps.controller.js
import * as mapsService from "../services/maps.service.js";
import * as mapsModel from "../models/maps.models.js";

/* ------------------- GET ROUTE ------------------- */
export const getRoute = async (req, res) => {
  try {
    const { origin, destination } = req.body;
    if (!origin || !destination)
      return res.status(400).json({ message: "Origin & destination required" });

    // Check cache first
    let route = await mapsModel.getCachedRoute(origin, destination);
    if (!route) {
      route = await mapsService.getRouteFromGoogle(origin, destination);
      await mapsModel.cacheRoute(origin, destination, route);
    }

    return res.status(200).json(route);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to get route", error: error.message });
  }
};

/* ------------------- DISTANCE MATRIX ------------------- */
export const getDistanceMatrix = async (req, res) => {
  try {
    const { origins, destinations } = req.body;
    if (!origins?.length || !destinations?.length)
      return res
        .status(400)
        .json({ message: "Origins and destinations required" });

    const matrix = await mapsService.getDistanceMatrixFromGoogle(
      origins,
      destinations,
    );
    return res.status(200).json(matrix);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to get distance matrix", error: error.message });
  }
};

/* ------------------- PLACE AUTOCOMPLETE ------------------- */
export const placeAutocomplete = async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) return res.status(400).json({ message: "Input required" });

    const results = await mapsService.placeAutocompleteFromGoogle(input);
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to get autocomplete", error: error.message });
  }
};

/* ------------------- PLACE DETAILS ------------------- */
export const getPlaceDetails = async (req, res) => {
  try {
    const { placeId } = req.query;
    if (!placeId) return res.status(400).json({ message: "placeId required" });

    const details = await mapsService.getPlaceDetailsFromGoogle(placeId);
    return res.status(200).json(details);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to get place details", error: error.message });
  }
};
