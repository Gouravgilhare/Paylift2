import { vehicleModel } from "../models/vehicle.model.js";
import * as vehiclePricingModel from "../models/vehiclePricing.model.js";

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

  // Vehicle Pricing Methods
  async createVehiclePricing(data) {
    return await vehiclePricingModel.createVehiclePricing(data);
  }

  async getVehiclePricingById(id) {
    return await vehiclePricingModel.getVehiclePricingById(id);
  }

  async getVehiclePricingByCategory(category) {
    return await vehiclePricingModel.getVehiclePricingByCategory(category);
  }

  async getAllVehiclePricing() {
    return await vehiclePricingModel.getAllVehiclePricing();
  }

  async updateVehiclePricingById(id, data) {
    return await vehiclePricingModel.updateVehiclePricingById(id, data);
  }

  async updateVehiclePricingByCategory(category, data) {
    return await vehiclePricingModel.updateVehiclePricingByCategory(
      category,
      data,
    );
  }

  async updateVehiclePricingComplete(category, data) {
    return await vehiclePricingModel.updateVehiclePricingComplete(
      category,
      data,
    );
  }

  async deleteVehiclePricing(id) {
    return await vehiclePricingModel.deleteVehiclePricing(id);
  }

  async vehiclePricingExists(category) {
    return await vehiclePricingModel.vehiclePricingExists(category);
  }

  async getPricingStats() {
    return await vehiclePricingModel.getPricingStats();
  }
}

export const vehicleService = new VehicleService();
