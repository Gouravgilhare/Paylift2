// modules/location/services/maps.service.js

import axios from "axios";
import "../../../config/env.config.js";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Get directions (route) from Google Maps Directions API
 */
export const getRouteFromGoogle = async (origin, destination) => {
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/directions/json",
    {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: GOOGLE_MAPS_API_KEY,
        mode: "driving",
      },
    },
  );
  return response.data;
};

/**
 * Get distance matrix
 */
export const getDistanceMatrixFromGoogle = async (origins, destinations) => {
  const originsParam = origins.map((o) => `${o.lat},${o.lng}`).join("|");
  const destinationsParam = destinations
    .map((d) => `${d.lat},${d.lng}`)
    .join("|");

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
    {
      params: {
        origins: originsParam,
        destinations: destinationsParam,
        key: GOOGLE_MAPS_API_KEY,
        mode: "driving",
      },
    },
  );

  return response.data;
};

/**
 * Place autocomplete
 */
export const placeAutocompleteFromGoogle = async (input) => {
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json",
    {
      params: {
        input,
        key: GOOGLE_MAPS_API_KEY,
        types: "geocode",
      },
    },
  );

  return response.data;
};

/**
 * Place details
 */
export const getPlaceDetailsFromGoogle = async (placeId) => {
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/place/details/json",
    {
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        fields: "formatted_address,geometry,name",
      },
    },
  );

  return response.data;
};
