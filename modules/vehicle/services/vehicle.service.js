import { vehicleModel } from "../models/vehicle.model.js";

class VehicleService {
  async createVehicle(data) {
    return await vehicleModel.createVehicle(data);
  }

  async getVehicleById(vehicleId) {
    return await vehicleModel.getVehicleById(vehicleId);
  }

  async getVehiclesByRider(riderId) {
    return await vehicleModel.getVehiclesByRider(riderId);
  }

  async updateVehicle(vehicleId, data) {
    return await vehicleModel.updateVehicle(vehicleId, data);
  }

  async deleteVehicle(vehicleId) {
    return await vehicleModel.deleteVehicle(vehicleId);
  }
}

export const vehicleService = new VehicleService();
