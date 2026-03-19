// backend/middleware/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    // 🔥 Decide folder based on route usage
    if (req.body.type === "vault") {
      return {
        folder: `photo-vault/${req.body.userId}/${req.body.folderName}`,
        allowed_formats: ["jpg", "png", "jpeg"],
      };
    }

    // ✅ Default = signup/profile
    return {
      folder: "users",
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});

const upload = multer({ storage });

export default upload;