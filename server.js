import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import userRoutes from "./routes/userRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import touristPlaceRoutes from "./routes/touristPlaceRoutes.js";
import packageDetailRoutes from "./routes/packageDetailRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

/* -------------------------------------------------------------------------- */
/*                                Configuration                               */
/* -------------------------------------------------------------------------- */
dotenv.config();
connectDB();

const app = express();

// Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for image links
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8000}`;

/* -------------------------------------------------------------------------- */
/*                                Middlewares                                 */
/* -------------------------------------------------------------------------- */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Serve uploaded images publicly
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
app.use("/api/users", userRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/tourist-places", touristPlaceRoutes);
app.use("/api/package-details", packageDetailRoutes);
app.use("/api/categories", categoryRoutes);

/* -------------------------------------------------------------------------- */
/*                            Root + Error Handlers                           */
/* -------------------------------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("🚀 Travel Backend API is running successfully...");
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: err.message,
  });
});

/* -------------------------------------------------------------------------- */
/*                                 Start Server                               */
/* -------------------------------------------------------------------------- */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running on ${BASE_URL}`);
});

// Export BASE_URL for controllers
export { BASE_URL };
