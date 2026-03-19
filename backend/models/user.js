// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  // 🔐 4 Digit GirlSpace Lock PIN
  pin: {
    type: String
  },

  // 📩 OTP for email verification
  otp: {
    type: String
  },

  // ⏳ OTP expiry time
  otpExpires: {
    type: Date
  }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;