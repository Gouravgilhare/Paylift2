import {
  extractTextFromPDF,
  extractTextFromImage,
} from "../services/extract.service.js";

class ExtractController {
  async extractInsuranceFromPDF(req, res) {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "PDF required" });

      const data = await extractTextFromPDF(req.file.path);

      res.json({ success: true, type: "insurance", data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async extractRCFromImage(req, res) {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "Image required" });

      const data = await extractTextFromImage(req.file.path);

      res.json({ success: true, type: "rc_card", data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async extractNumberPlate(req, res) {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "Image required" });

      const data = await extractTextFromImage(req.file.path);

      res.json({ success: true, type: "number_plate", data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export const extractController = new ExtractController();
