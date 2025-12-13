import { locationModel } from "../models/location.model.js";

class LocationService {
  async updateLiveLocation(entity_id, entity_type, latitude, longitude) {
    const old = await locationModel.getLiveLocation(entity_id, entity_type);

    await locationModel.upsertLiveLocation(
      entity_id,
      entity_type,
      latitude,
      longitude
    );

    if (old) {
      await locationModel.logLocationChange(
        entity_id,
        entity_type,
        old.latitude,
        old.longitude,
        latitude,
        longitude
      );
    }

    return true;
  }

  async getLiveLocation(entity_id, entity_type) {
    return await locationModel.getLiveLocation(entity_id, entity_type);
  }

  async addTripHistory(data) {
    return await locationModel.insertTripHistory(data);
  }

  async getTripHistory(trip_id) {
    return await locationModel.getTripHistory(trip_id);
  }
}

export const locationService = new LocationService();
