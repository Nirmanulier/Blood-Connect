import express from "express";
import dotenv from "dotenv";
dotenv.config(); // must run before anything that reads process.env

import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js"
import requestRoutes from "./routes/request.route.js";
import bankRoutes from "./routes/bank.route.js";
import campRoutes from "./routes/camp.route.js";
import donationRoutes from "./routes/donation.route.js";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/donations", donationRoutes);



const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});