import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import vaultRoutes from "./routes/vaultRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);

app.get("/", (req, res) => {
  res.send("Server is working");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI) // ✅ remove useNewUrlParser & useUnifiedTopology
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
console.log("JWT SECRET:", process.env.JWT_SECRET);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));