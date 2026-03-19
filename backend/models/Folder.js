import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: String,
  userId: String,

  images: [
    {
      url: String,
      public_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 FIX: prevent overwrite error
const Folder = mongoose.models.Folder || mongoose.model("Folder", folderSchema);

export default Folder;