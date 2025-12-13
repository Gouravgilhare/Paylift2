import { tripModel } from "../models/trip.model.js";

class TripService {
  async createTrip(data) {
    return await tripModel.createTrip(data);
  }

  async getTripById(tripId) {
    return await tripModel.getTripById(tripId);
  }

  async assignRiderToTrip(tripId, riderId, vehicleId) {
    return await tripModel.assignRider(tripId, riderId, vehicleId);
  }

  async startTrip(tripId) {
    return await tripModel.updateTrip(tripId, { status: "ongoing" });
  }

  async updateDistanceAndTime(tripId, distance_km, duration_minutes) {
    return await tripModel.updateTrip(tripId, {
      distance_km,
      duration_minutes,
    });
  }

  async completeTrip(tripId, total_fare) {
    return await tripModel.updateTrip(tripId, {
      status: "completed",
      total_fare,
      payment_status: "paid",
    });
  }

  async cancelTrip(tripId) {
    return await tripModel.updateTrip(tripId, { status: "cancelled" });
  }

  async getUserTrips(userId) {
    return await tripModel.getUserTrips(userId);
  }

  async getRiderTrips(riderId) {
    return await tripModel.getRiderTrips(riderId);
  }
}

export const tripService = new TripService();
