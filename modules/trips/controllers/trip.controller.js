import { tripService } from "../services/trip.service.js";

class TripController {
  async createTrip(req, res) {
    try {
      const data = req.body;

      const trip = await tripService.createTrip(data);
      res.status(201).json({ success: true, trip });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  }

  async getTripById(req, res) {
    const { tripId } = req.params;

    const trip = await tripService.getTripById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.json({ success: true, trip });
  }

  async assignRider(req, res) {
    const { tripId } = req.params;
    const { riderId, vehicleId } = req.body;

    const result = await tripService.assignRiderToTrip(
      tripId,
      riderId,
      vehicleId
    );
    res.json({ success: result });
  }

  async startTrip(req, res) {
    const { tripId } = req.params;
    const result = await tripService.startTrip(tripId);

    res.json({ success: result, message: "Trip started" });
  }

  async updateDistanceAndTime(req, res) {
    const { tripId } = req.params;
    const { distance_km, duration_minutes } = req.body;

    const result = await tripService.updateDistanceAndTime(
      tripId,
      distance_km,
      duration_minutes
    );

    res.json({ success: result });
  }

  async completeTrip(req, res) {
    const { tripId } = req.params;
    const { total_fare } = req.body;

    const result = await tripService.completeTrip(tripId, total_fare);
    res.json({ success: result });
  }

  async cancelTrip(req, res) {
    const { tripId } = req.params;

    const result = await tripService.cancelTrip(tripId);
    res.json({ success: result });
  }
}

export const tripController = new TripController();
