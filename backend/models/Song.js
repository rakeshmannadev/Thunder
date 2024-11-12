import mongoose from "mongoose";

const songSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: Number,
    },
    duration: {
      type: Number,
      required: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: false,
    },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);
export default Song;
