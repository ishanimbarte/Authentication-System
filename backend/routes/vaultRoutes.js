import express from "express";
import upload from "../middleware/upload.js";
import Folder from "../models/Folder.js";
import cloudinary from "../config/cloudinary.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ CREATE FOLDER
router.post("/create-folder", authMiddleware, async (req, res) => {
  try {
    const { name, userId } = req.body;

    const folder = new Folder({
      name,
      userId,
      images: [],
    });

    await folder.save();
    res.json(folder);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL FOLDERS
router.get("/folders/:userId", authMiddleware, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.params.userId });
    res.json(folders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET SINGLE FOLDER
router.get("/folder/:folderId", authMiddleware, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.folderId);

    if (!folder) {
      return res.json({ images: [] });
    }

    res.json(folder);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPLOAD IMAGE
router.post("/upload", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { folderId } = req.body;

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    folder.images.push({
      url: req.file.path,
      public_id: req.file.filename,
    });

    await folder.save();

    res.json(folder);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE IMAGE
router.delete("/image/:folderId/:imageId", authMiddleware, async (req, res) => {
  try {
    const { folderId, imageId } = req.params;

    console.log("DELETE REQUEST:", folderId, imageId);

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (!folder.images || folder.images.length === 0) {
      return res.status(400).json({ message: "No images found" });
    }

    const imageExists = folder.images.find(
      (img) => img._id.toString() === imageId
    );

    if (!imageExists) {
      return res.status(404).json({ message: "Image not found" });
    }

    // ✅ remove image
    folder.images = folder.images.filter(
      (img) => img._id.toString() !== imageId
    );

    await folder.save();

    res.json({
      message: "Image deleted successfully",
      images: folder.images,
    });

  } catch (error) {
    console.log("DELETE IMAGE ERROR:", error);
    res.status(500).json({ message: "Server error while deleting image" });
  }
});

export default router;