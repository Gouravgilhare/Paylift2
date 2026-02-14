import { uploadToGCS } from "../../../config/multer.config.js";
import { vehicleService } from "../services/vehicle.service.js";

class VehicleController {
  // Create vehicle
  async createVehicle(req, res) {
    try {
      const data = { ...req.body };

      if (req.files?.vehicle_image) {
        data.vehicle_image = await uploadToGCS(req.files.vehicle_image[0]);
      }

      if (req.files?.rc_image) {
        data.rc_image = await uploadToGCS(req.files.rc_image[0]);
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
        data.vehicle_image = await uploadToGCS(req.files.vehicle_image[0]);
      }

      if (req.files?.rc_image) {
        data.rc_image = await uploadToGCS(req.files.rc_image[0]);
      }

      const updated = await vehicleService.updateVehicle(vehicleId, data);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      }

      res.json({
        success: true,
        message: "Vehicle updated successfully",
      });
    } catch (error) {
      console.error("Vehicle update error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Delete vehicle
  async deleteVehicle(req, res) {
    try {
      const { vehicleId } = req.params;

      const deleted = await vehicleService.deleteVehicle(vehicleId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      }

      res.json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ================= PRICING =================

  async createVehiclePricing(req, res) {
    try {
      const result = await vehicleService.createVehiclePricing(req.body);
      res.status(201).json({
        success: true,
        message: "Vehicle pricing created successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }

  async getVehiclePricingById(req, res) {
    try {
      const pricing = await vehicleService.getVehiclePricingById(req.params.id);
      if (!pricing) {
        return res
          .status(404)
          .json({ success: false, message: "Pricing not found" });
      }
      res.json({ success: true, data: pricing });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getVehiclePricingByCategory(req, res) {
    try {
      const pricing = await vehicleService.getVehiclePricingByCategory(
        req.params.category,
      );
      if (!pricing) {
        return res.status(404).json({
          success: false,
          message: "Pricing not found for this category",
        });
      }
      res.json({ success: true, data: pricing });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getAllVehiclePricing(req, res) {
    try {
      const pricing = await vehicleService.getAllVehiclePricing();
      res.json({ success: true, data: pricing });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async updateVehiclePricingById(req, res) {
    try {
      const updated = await vehicleService.updateVehiclePricingById(
        req.params.id,
        req.body,
      );
      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Pricing not found" });
      }
      res.json({ success: true, message: "Pricing updated successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async updateVehiclePricingByCategory(req, res) {
    try {
      const updated = await vehicleService.updateVehiclePricingByCategory(
        req.params.category,
        req.body,
      );
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Pricing not found for this category",
        });
      }
      res.json({ success: true, message: "Pricing updated successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async deleteVehiclePricing(req, res) {
    try {
      const deleted = await vehicleService.deleteVehiclePricing(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Pricing not found" });
      }
      res.json({ success: true, message: "Pricing deleted successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getPricingStats(req, res) {
    try {
      const stats = await vehicleService.getPricingwStats();
      res.json({ success: true, data: stats });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export const vehicleController = new VehicleController();
