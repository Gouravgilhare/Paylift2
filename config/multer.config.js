import multer from "multer";
import path from "path";
import fs from "fs";

const BASE_UPLOAD_DIR = "uploads";

// Ensure directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "Others";

    switch (file.fieldname) {
      case "vehicle_image":
        folder = "Vehicle_number";
        break;
      case "user_image":
        folder = "User";
        break;
      case "dl_image":
        folder = "DL";
        break;
      case "rc_image":
        folder = "RC";
        break;
    }

    const uploadDir = path.join(BASE_UPLOAD_DIR, folder);
    ensureDirExists(uploadDir);
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const randomPart = Math.round(Math.random() * 1e4);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/\s+/g, "_");

    cb(null, `${basename}_${timestamp}_${randomPart}${ext}`);
  },
});

// Cleaner & correct MIME list
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, PNG are allowed"));
  }
};

// 1 MB limit
const limits = {
  fileSize: 1 * 1024 * 1024,
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
