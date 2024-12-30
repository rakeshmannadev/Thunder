import mongoose from "mongoose";

const songSchema = mongoose.Schema(
  {
    songId: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    artists: {
      type: Object,
      default:{},
    },
      artistId:{
        type: String,
      },
    imageUrl: {
      type: String,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: String,
    },
    releaseDate:{
      type:String,
    },
    duration: {
      type: Number,
      required: true,
    },
    playCount:{
      type:String,
    },
    language:{
      type:String,
    },
    label:{
      type:String,
    },
    albumId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);
export default Song;
