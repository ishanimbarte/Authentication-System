// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ default export
import upload from "../middleware/upload.js";

const router = express.Router();

// Signup route
router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const { name, email, password } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const image = req.file.path;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      image
    });

    await user.save();

    res.json({ message: "User registered successfully", user });

  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; // ✅ default export