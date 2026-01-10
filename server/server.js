import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import userRouter from "./routes/userRoutes.js";
/* ... imports ... */

dotenv.config();

const app = express();

// 1. DYNAMIC CORS (Crucial for hosting)
// Change this part
const allowedOrigins = [
  "http://localhost:5173", 
  process.env.FRONTEND_URL // Ensure this matches your Netlify URL exactly
].filter(Boolean); // This removes any "undefined" values if the env isn't set yet

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

/* ===== ROUTES ===== */
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/owner", ownerRouter);
app.use("/api", userRouter);

// 2. SERVING STATIC FILES (For Linux hosting environments)
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===== DATABASE ===== */
// 3. ADD CONNECTION OPTIONS
/* ===== DATABASE ===== */
// Remove useNewUrlParser and useUnifiedTopology
mongoose
  .connect(process.env.MONGO_URL) 
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });
/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000; // Cloud hosts like Render/Railway will provide this
app.listen(PORT, '0.0.0.0', () => // Binding to 0.0.0.0 is better for some cloud hosts
  console.log(`Server running on port ${PORT}`)
);
