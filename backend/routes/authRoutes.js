import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import upload from "../middleware/upload.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();


// ================== SIGNUP ==================
router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validations
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.path
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================== LOGIN ==================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validations
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      user,
      token
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================== SEND OTP ==================
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "GirlSpace OTP Verification",
      `Your OTP is ${otp}`
    );

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    console.log("SEND OTP ERROR:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});


// ================== VERIFY OTP ==================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email & OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "OTP verified" });

  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================== RESET PIN ==================
router.post("/reset-pin", async (req, res) => {
  try {
    const { email, newPin } = req.body;

    if (!email || !newPin) {
      return res.status(400).json({ message: "Email & PIN required" });
    }

    if (newPin.length !== 4) {
      return res.status(400).json({ message: "PIN must be 4 digits" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPin = await bcrypt.hash(newPin, 10);

    user.pin = hashedPin;
    await user.save();

    res.json({ message: "PIN reset successful" });

  } catch (error) {
    console.log("RESET PIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================== VERIFY PIN ==================
router.post("/verify-pin", async (req, res) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ message: "Email & PIN required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.pin) {
      return res.status(400).json({ message: "PIN not set" });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    res.json({ message: "PIN verified" });

  } catch (error) {
    console.log("VERIFY PIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================== VERIFY EMAIL ==================
router.post("/verify-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    console.log("VERIFY EMAIL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================== EXPORT ==================
export default router;