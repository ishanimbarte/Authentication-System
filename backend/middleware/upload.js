// backend/middleware/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ✅ Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "users",                  // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // allowed image formats
  },
});

// ✅ Multer upload instance
const upload = multer({ storage });

export default upload;