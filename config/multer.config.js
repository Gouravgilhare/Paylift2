import multer from "multer";
import { Storage } from "@google-cloud/storage";
import path from "path";
import "./env.config.js";
// Initialize GCS
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// ---------- Multer Setup (Memory Storage) ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, JPG, PNG, PDF allowed"));
    }
  },
});

// ---------- Helper: Get Folder Name ----------
const getFolder = (fieldname) => {
  switch (fieldname) {
    case "vehicle_image":
      return "Vehicle_number";
    case "user_image":
      return "User";
    case "dl_image":
      return "DL";
    case "rc_image":
      return "RC";
    case "document":
      return "Documents";
    default:
      return "Others";
  }
};

// ---------- Upload to GCS ----------
export const uploadToGCS = async (file) => {
  const folder = getFolder(file.fieldname);

  const timestamp = Date.now();
  const randomPart = Math.round(Math.random() * 1e4);
  const ext = path.extname(file.originalname);
  const basename = path.basename(file.originalname, ext).replace(/\s+/g, "_");

  const filename = `${folder}/${basename}_${timestamp}_${randomPart}${ext}`;

  const blob = bucket.file(filename);

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", reject);

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};
// At bottom of your multer config file

export { bucket }; // 👈 ADD THIS
export default upload;
