import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Optional: try to import sharp
let sharp = null;
try {
  const sharpModule = require("sharp");
  sharp = sharpModule;
} catch {
  console.warn("Sharp not available - RC image preprocessing disabled");
}

// ------------------------------
// REGEX PATTERNS
// ------------------------------
const REGEX_VEHICLE_REG =
  /\b([A-Z]{2}\s*[-]?\s*\d{1,2}\s*[-]?\s*[A-Z]{0,3}\s*[-]?\s*\d{1,4})\b/i;
const REGEX_POLICY_NO =
  /\b(?:policy\s*(?:no|number|#)?\s*[:\-\s]*)\s*([A-Z0-9\/\-]{6,40})/i;
const REGEX_NAME =
  /\b(?:name\s*(?:of\s*the)?\s*(?:insured|proposer)|insured\s*name|insured)\s*[:\-\s]{0,3}(.{2,120})/i;
const REGEX_DATE_GENERIC =
  /(?:\d{1,2}[\/\-.\s]\d{1,2}[\/\-.\s]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\,?\s*\d{2,4}|\w+\s+\d{1,2},\s*\d{4})/gi;

// ==============================
// RC EXTRACTION HELPERS (MOVED UP)
// ==============================

const fixDigits = (s) =>
  s
    .replace(/O/g, "0")
    .replace(/D/g, "0")
    .replace(/I/g, "1")
    .replace(/L/g, "1")
    .replace(/Z/g, "2")
    .replace(/S/g, "5")
    .replace(/B/g, "8")
    .replace(/G/g, "9")
    .replace(/V/g, "4");

const fixLetters = (s) =>
  s
    .replace(/0/g, "O")
    .replace(/1/g, "I")
    .replace(/2/g, "Z")
    .replace(/5/g, "S")
    .replace(/8/g, "B");

const isValidRC = (rc) => /^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/.test(rc);

async function preprocessRCImage(filePath) {
  if (!sharp) {
    return fs.readFileSync(filePath);
  }

  const buffer = fs.readFileSync(filePath);
  try {
    return await sharp(buffer)
      .resize({ width: 1500, height: 1000, fit: "contain", background: { r: 255, g: 255, b: 255 } })
      .grayscale()
      .normalize()
      .sharpen()
      .threshold(120)
      .toBuffer();
  } catch (err) {
    console.warn("Image preprocessing failed, using original:", err.message);
    return buffer;
  }
}

// ------------------------------
// HELPERS
// ------------------------------
function cleanPolicyNumber(raw) {
  if (!raw) return null;
  let s = raw.toUpperCase().replace(/[^A-Z0-9\/-]/g, "");

  const stopWords = [
    "UIN",
    "NAME",
    "PERIOD",
    "FROM",
    "TO",
    "INSURED",
    "VEHICLE",
    "CERTIFICATE",
    "TYPE",
    "ADDRESS",
  ];
  for (const w of stopWords) {
    const idx = s.indexOf(w);
    if (idx !== -1) s = s.slice(0, idx);
  }

  s = s.replace(/^[-/]+|[-/]+$/g, "");
  return s.length >= 8 && s.length <= 60 ? s : null;
}

function normalizeVehicleReg(raw) {
  if (!raw) return null;
  let s = raw.toUpperCase();
  s = s.replace(/VEHICLE\s*NO[:.\s-]*/g, "");
  s = s.replace(/VEHICLE\s*REG(ISTRATION)?[:.\s-]*/g, "");
  s = s.replace(/[\s-]/g, "");
  s = s.replace(/[^A-Z0-9]/g, "");
  const letters = (s.match(/[A-Z]/g) || []).length;
  const digits = (s.match(/\d/g) || []).length;
  return letters >= 2 && digits >= 3 ? s : null;
}

function parseDateSafe(str) {
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function extractInsuranceFields(text) {
  if (!text) return {};

  const lines = text
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const joined = lines.join("\n");

  const result = {
    policy_number: null,
    insured_name: null,
    vehicle_registration: null,
    expiry_date: null,
    raw_text_snippet: null,
  };

  // Extract fields
  const pm = joined.match(REGEX_POLICY_NO);
  if (pm) result.policy_number = cleanPolicyNumber(pm[1]);

  const nm = joined.match(REGEX_NAME);
  if (nm) result.insured_name = nm[1].split(",")[0].trim().toUpperCase();

  const vm = joined.match(REGEX_VEHICLE_REG);
  if (vm) result.vehicle_registration = normalizeVehicleReg(vm[1]);

  // Extract dates (pick latest)
  const dates = [];
  let m;
  while ((m = REGEX_DATE_GENERIC.exec(joined)) !== null) {
    const iso = parseDateSafe(m[0]);
    if (iso) dates.push({ iso, raw: m[0] });
  }
  if (dates.length) {
    dates.sort((a, b) => (a.iso < b.iso ? 1 : -1));
    result.expiry_date = dates[0].iso;
    result.raw_text_snippet = dates[0].raw;
  }

  result._found_fields = [
    result.policy_number,
    result.insured_name,
    result.vehicle_registration,
    result.expiry_date,
  ].filter(Boolean).length;

  return result;
}

// ==============================
// SERVICE CLASS
// ==============================
export class ExtractService {
  readFile(filePath) {
    return fs.readFileSync(path.resolve(filePath));
  }

  // -------- PDF Extraction --------
  async extractTextFromPDF(filePath) {
    const buffer = this.readFile(filePath);
    const data = await pdfParse(buffer);
    return data.text || "";
  }

  // -------- Image OCR (generic) --------
  async extractTextFromImage(filePath) {
    const buffer = this.readFile(filePath);
    const {
      data: { text },
    } = await Tesseract.recognize(buffer, "eng", {
      logger: (m) => console.log("OCR progress:", m.progress),
      tessedit_pageseg_mode: 6,
    });
    return text || "";
  }

  // -------- INSURANCE (PDF) --------
  async extractInsurance(filePath) {
    const text = await this.extractTextFromPDF(filePath);
    const fields = extractInsuranceFields(text);
    return { ...fields, raw_text: text };
  }

  // -------- VEHICLE NUMBER (IMAGE) --------
  async extractVehicleNumber(filePath) {
    const text = await this.extractTextFromImage(filePath);
    const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, "");

    const patterns = [
      /[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}/,
      /[A-Z]{2}\d{2}[A-Z]\d{3,4}/,
    ];

    for (const p of patterns) {
      const m = clean.match(p);
      if (m) return { vehicle_number: m[0], raw_ocr: text };
    }

    return { vehicle_number: null, raw_ocr: text };
  }

  // -------- DL NUMBER (IMAGE) --------
  async extractDLNumber(filePath) {
    const text = await this.extractTextFromImage(filePath);
    let clean = text.toUpperCase().replace(/[^A-Z0-9]/g, "");

    const fixes = { O: "0", I: "1", L: "1", S: "5", B: "8" };
    Object.entries(fixes).forEach(
      ([k, v]) => (clean = clean.replace(new RegExp(k, "g"), v)),
    );

    const patterns = [/TN\d{2}20\d{2}\d{5,7}/, /[A-Z]{2}\d{2}\d{11,14}/];

    for (const p of patterns) {
      const m = clean.match(p);
      if (m) return { dl_number: m[0], raw_ocr: text };
    }

    return { dl_number: null, raw_ocr: text };
  }

  // -------- RC NUMBER (IMAGE – improved) --------
  async extractRCNumber(filePath) {
    try {
      const buffer = await preprocessRCImage(filePath);
      const {
        data: { text },
      } = await Tesseract.recognize(buffer, "eng", {
        logger: (m) => console.log("RC OCR progress:", m.progress),
        tessedit_pageseg_mode: 3,
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789- ",
      });

      console.log("Raw RC OCR text:", text);

      let normalized = text
        .toUpperCase()
        .replace(/[^A-Z0-9\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      console.log("Normalized RC text:", normalized);

      const candidates = [];

      // Pattern 1: With spaces (XX 00 XX 0000)
      const pattern1 = /([A-Z]{2})\s+([0-9]{2})\s+([A-Z]{1,3})\s+([0-9]{4})/g;
      let m;
      while ((m = pattern1.exec(normalized)) !== null) {
        const rc = `${m[1]}${fixDigits(m[2])}${m[3]}${fixDigits(m[4])}`;
        if (isValidRC(rc)) {
          candidates.push({ rc, confidence: 0.95 });
          console.log("Pattern 1 match:", rc);
        }
      }

      // Pattern 2: Without spaces (XX00XX0000)
      const pattern2 = /([A-Z]{2})([0-9]{2})([A-Z]{1,3})([0-9]{4})/g;
      while ((m = pattern2.exec(normalized)) !== null) {
        const rc = `${m[1]}${fixDigits(m[2])}${m[3]}${fixDigits(m[4])}`;
        if (isValidRC(rc)) {
          candidates.push({ rc, confidence: 0.90 });
          console.log("Pattern 2 match:", rc);
        }
      }

      // Pattern 3: With dashes (XX-00-XX-0000)
      const pattern3 = /([A-Z]{2})-([0-9]{2})-([A-Z]{1,3})-([0-9]{4})/g;
      while ((m = pattern3.exec(normalized)) !== null) {
        const rc = `${m[1]}${fixDigits(m[2])}${m[3]}${fixDigits(m[4])}`;
        if (isValidRC(rc)) {
          candidates.push({ rc, confidence: 0.92 });
          console.log("Pattern 3 match:", rc);
        }
      }

      if (candidates.length > 0) {
        candidates.sort((a, b) => b.confidence - a.confidence);
        console.log("Best RC candidate:", candidates[0]);
        return {
          rc_number: candidates[0].rc,
          raw_ocr: text,
          confidence: candidates[0].confidence,
        };
      }

      console.log("No RC matches found");
      return { rc_number: null, raw_ocr: text, confidence: 0 };
    } catch (err) {
      console.error("RC extraction error:", err);
      return { rc_number: null, raw_ocr: "", confidence: 0, error: err.message };
    }
  }
}

export const extractService = new ExtractService();
