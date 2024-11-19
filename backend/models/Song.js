import mongoose from "mongoose";

const songSchema = mongoose.Schema(
  {
    songId:{
      type:String,
      
    },
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
    albumId: {
      type:String,
      required: false,
    },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);
export default Song;
