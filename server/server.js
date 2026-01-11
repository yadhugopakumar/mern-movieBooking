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

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false); // no error throw
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.options("*", cors());


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
