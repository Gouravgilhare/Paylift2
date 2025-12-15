import { locationService } from "../services/location.service.js";

class LocationController {
  // == LIVE LOCATION ==
  async updateLiveLocation(req, res) {
    try {
      const { entity_id, entity_type, latitude, longitude } = req.body;

      await locationService.updateLiveLocation(
        entity_id,
        entity_type,
        latitude,
        longitude
      );

      res.json({ success: true, message: "Live location updated" });
    } catch (err) {
      console.error("Update live location error:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  async getLiveLocation(req, res) {
    try {
      const { entity_id, entity_type } = req.params;

      const data = await locationService.getLiveLocation(
        entity_id,
        entity_type
      );

      if (!data)
        return res
          .status(404)
          .json({ success: false, message: "Location not found" });

      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // == TRIP HISTORY ==
  async addTripHistory(req, res) {
    try {
      const data = req.body;
      const result = await locationService.addTripHistory(data);

      res.json({
        success: true,
        message: "Location added to trip history",
        data: result,
      });
    } catch (err) {
      console.error("History insert error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getTripHistory(req, res) {
    try {
      const { trip_id } = req.params;
      const history = await locationService.getTripHistory(trip_id);

      res.json({ success: true, data: history });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export const locationController = new LocationController();
