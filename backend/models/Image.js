import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: String,
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Image = mongoose.model("Image", imageSchema);

export default Image;