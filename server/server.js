import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

/* ===== ROUTES ===== */
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/owner", ownerRouter);
app.use("/api", userRouter);

/* ===== DATABASE ===== */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB connection failed", err));

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
