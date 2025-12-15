import { createRequire } from "module";
import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const pdf = pdfParse.default || pdfParse;

export class ExtractService {
  readFileAsBuffer(filePath) {
    return fs.readFileSync(path.resolve(filePath));
  }

  async extractTextFromPDF(filePath) {
    const buffer = this.readFileAsBuffer(filePath);
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw err;
    }
  }

  async extractTextFromImage(filePath) {
    const buffer = this.readFileAsBuffer(filePath);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(buffer, "eng", {
        logger: (m) => console.log("Tesseract:", m.status, m.progress),
      });
      return text;
    } catch (err) {
      console.error("Image OCR error:", err);
      throw err;
    }
  }

  // Optional: parse insurance info from PDF text
  parseInsuranceDetails(text) {
    return {
      policy_number: this.match(text, /Policy\s*No[:\s]*([A-Z0-9-]+)/i),
      insurer: this.match(text, /(ICICI|HDFC|Bajaj|Reliance|TATA|United)/i),
      vehicle_number: this.match(text, /[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}/),
      valid_from: this.match(text, /From[:\s]*(\d{2}\/\d{2}\/\d{4})/),
      valid_to: this.match(text, /To[:\s]*(\d{2}\/\d{2}\/\d{4})/),
    };
  }

  match(text, regex) {
    const match = text.match(regex);
    return match ? match[1] || match[0] : null;
  }
}

export const extractService = new ExtractService();
