import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

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
import locationRoutes from "./modules/location/routes/location.routes.js";
import tripRoutes from "./modules/trips/routes/trip.routes.js";
import extracRoutes from "./modules/document-extract/routes/extract.routes.js";

const app = express();

// ================= MIDDLEWARES =================
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
  })
);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/extract/", extracRoutes);

// ================= BASIC HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Paylift Backend API is running 🚀",
  });
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
