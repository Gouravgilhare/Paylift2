import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParsePkg = require("pdf-parse");

// const require = createRequire(import.meta.url);
// const pdfParsePkg = require("pdf-parse");
// const pdfParse = pdfParsePkg.default || pdfParsePkg;

// ------------------------------
// REGEX (ported from Python)
// ------------------------------

const REGEX_VEHICLE_REG =
  /\b([A-Z]{2}\s*[-]?\s*\d{1,2}\s*[-]?\s*[A-Z]{0,3}\s*[-]?\s*\d{1,4})\b/i;

const REGEX_POLICY_NO =
  /\b(?:policy\s*(?:no|number|#)?\s*[:\-\s]*)\s*([A-Z0-9\/\-]{6,40})/i;

const REGEX_NAME =
  /\b(?:name\s*(?:of\s*the)?\s*(?:insured|proposer)|insured\s*name|insured)\s*[:\-\s]{0,3}(.{2,120})/i;

const REGEX_DATE_GENERIC =
  /(?:\d{1,2}[\/\-.\s]\d{1,2}[\/\-.\s]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\,?\s*\d{2,4}|\w+\s+\d{1,2},\s*\d{4})/gi;

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

// ------------------------------
// TEXT FIELD EXTRACTION
// ------------------------------

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

  // Policy number
  const pm = joined.match(REGEX_POLICY_NO);
  if (pm) result.policy_number = cleanPolicyNumber(pm[1]);

  // Insured name
  const nm = joined.match(REGEX_NAME);
  if (nm) result.insured_name = nm[1].split(",")[0].trim().toUpperCase();

  // Vehicle number
  const vm = joined.match(REGEX_VEHICLE_REG);
  if (vm) result.vehicle_registration = normalizeVehicleReg(vm[1]);

  // Dates – pick latest
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

// ------------------------------
// SERVICE CLASS
// ------------------------------

export class ExtractService {
  readFile(filePath) {
    return fs.readFileSync(path.resolve(filePath));
  }
  async extractTextFromPDF(filePath) {
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n";
    }

    return fullText.trim();
  } 

  async extractTextFromImage(filePath) {
    const buffer = this.readFile(filePath);
    const {
      data: { text },
    } = await Tesseract.recognize(buffer, "eng");
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
    Object.entries(fixes).forEach(([k, v]) => {
      clean = clean.replace(new RegExp(k, "g"), v);
    });

    const patterns = [/TN\d{2}20\d{2}\d{5,7}/, /[A-Z]{2}\d{2}\d{11,14}/];

    for (const p of patterns) {
      const m = clean.match(p);
      if (m) return { dl_number: m[0], raw_ocr: text };
    }

    return { dl_number: null, raw_ocr: text };
  }

  // -------- RC NUMBER (IMAGE – heuristic) --------
  async extractRCNumber(filePath) {
    const text = await this.extractTextFromImage(filePath);
    const up = text.toUpperCase().replace(/\s+/g, " ");

    const strict =
      /\b([A-Z]{2})\s*([0-9OIL]{2})\s*([A-Z]{1,2})\s*([0-9OIL]{4})\b/;
    const m = up.match(strict);

    if (m) {
      const fix = (s) => s.replace(/[O]/g, "0").replace(/[IL]/g, "1");
      const rc = `${m[1]}${fix(m[2])}${m[3]}${fix(m[4])}`;
      return { rc_number: rc, raw_ocr: text, confidence: 0.95 };
    }

    return { rc_number: null, raw_ocr: text, confidence: 0 };
  }
}

export const extractService = new ExtractService();
