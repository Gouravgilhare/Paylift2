import { extractService } from "../services/extract.service.js";

class ExtractController {
  // ---------- INSURANCE PDF ----------
  async extractInsuranceFromPDF(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "PDF file is required" });
      }

      const result = await extractService.extractInsurance(req.file.buffer);

      return res.json({
        success: true,
        type: "insurance",
        data: result,
      });
    } catch (err) {
      console.error("Insurance extraction error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to extract insurance data",
        error: err.message,
      });
    }
  }

  // ---------- RC CARD ----------
  async extractRCFromImage(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Image file is required" });
      }

      const result = await extractService.extractRCNumber(req.file.buffer);

      return res.json({
        success: true,
        type: "rc_card",
        data: result,
      });
    } catch (err) {
      console.error("RC extraction error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to extract RC number",
      });
    }
  }

  // ---------- NUMBER PLATE ----------
  async extractNumberPlate(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Image file is required" });
      }

      const result = await extractService.extractVehicleNumber(req.file.buffer);

      return res.json({
        success: true,
        type: "number_plate",
        data: result,
      });
    } catch (err) {
      console.error("Number plate extraction error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to extract number plate",
      });
    }
  }

  // ---------- DRIVING LICENSE ----------
  async extractDLFromImage(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Image file is required" });
      }

      const result = await extractService.extractDLNumber(req.file.buffer);

      return res.json({
        success: true,
        type: "driving_license",
        data: result,
      });
    } catch (err) {
      console.error("DL extraction error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to extract DL number",
        error: err.message,
      });
    }
  }
}

export const extractController = new ExtractController();
