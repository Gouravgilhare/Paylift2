import { vehicleService } from "../services/vehicle.service.js";

class VehicleController {
  // Create vehicle
  async createVehicle(req, res) {
    try {
      const data = req.body;

      // File uploads
      if (req.files?.vehicle_image) {
        data.vehicle_image = req.files.vehicle_image[0].path;
      }
      if (req.files?.rc_image) {
        data.rc_image = req.files.rc_image[0].path;
      }

      const vehicle = await vehicleService.createVehicle(data);

      return res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        data: vehicle,
      });
    } catch (error) {
      console.error("Vehicle create error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Get vehicle
  async getVehicle(req, res) {
    try {
      const { vehicleId } = req.params;
      const vehicle = await vehicleService.getVehicleById(vehicleId);

      if (!vehicle)
        return res
          .status(404)
          .json({ success: false, message: "Vehicle not found" });

      res.json({ success: true, data: vehicle });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Get vehicles by rider
  async getRiderVehicles(req, res) {
    try {
      const { riderId } = req.params;
      const vehicles = await vehicleService.getVehiclesByRider(riderId);

      res.json({ success: true, data: vehicles });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Update vehicle
  async updateVehicle(req, res) {
    try {
      const { vehicleId } = req.params;
      const data = req.body;

      if (req.files?.vehicle_image) {
        data.vehicle_image = req.files.vehicle_image[0].path;
      }
      if (req.files?.rc_image) {
        data.rc_image = req.files.rc_image[0].path;
      }

      const updated = await vehicleService.updateVehicle(vehicleId, data);

      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Vehicle not found" });

      res.json({ success: true, message: "Vehicle updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Delete vehicle
  async deleteVehicle(req, res) {
    try {
      const { vehicleId } = req.params;

      const deleted = await vehicleService.deleteVehicle(vehicleId);

      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "Vehicle not found" });

      res.json({ success: true, message: "Vehicle deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export const vehicleController = new VehicleController();
