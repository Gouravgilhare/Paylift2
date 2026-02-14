import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morganMiddleware from "./middleware/morgan.logger.js";
import { requestLogger } from "./middleware/logging.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pool from "./config/db.config.js";
import { bucket } from "./config/multer.config.js";

// Load .env
dotenv.config();

// Convert ES module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routes
import authRoutes from "./modules/auth/routes/auth.routes.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import riderRoutes from "./modules/rider/routes/rider.routes.js";
import vehicleRoutes from "./modules/vehicle/routes/vehicle.routes.js";
import tripRoutes from "./modules/trips/routes/trip.routes.js";
import locationRoutes from "./modules/location/routes/location.routes.js";
import extractRoutes from "./modules/extract/routes/extract.routes.js";
import adminRoutes from "./modules/admin/routes/admin.routes.js";
import mapRoutes from "./modules/maps/routes/maps.routes.js";

const app = express();

// ================= MIDDLEWARES =================
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
  }),
);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging middlewares
app.use(morganMiddleware);
app.use(requestLogger);

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/extract/", extractRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/maps", mapRoutes);

// ================= BASIC HEALTH CHECK =================
app.get("/", async (req, res) => {
  try {
    // DB Check
    const [result] = await pool.query("SHOW TABLES");

    // GCS Bucket Check
    const [exists] = await bucket.exists();

    res.status(200).json({
      message: "Paylift Backend API is running 🚀",
      message2: "Deployed via github actions",
      DB_Connection:
        result.length >= 0 ? "DB is Connected!!" : "DB issue detected",
      Multer_Storage: exists
        ? "Multer is connected with GCS bucket ✅"
        : "Multer not connected with GCS bucket ❌",
    });
  } catch (error) {
    res.status(500).json({
      message: "Backend running but service issue ❌",
      error: error.message,
    });
  }
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
