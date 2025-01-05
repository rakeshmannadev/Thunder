import mongoose from "mongoose";
const playlistSchema = mongoose.Schema({

  playlistId: {
    type: String,
    required: false,
    default:null,
  },
  albumId:{
    type:String,
    default:null,
  },
  playlistName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  year: {
    type: String,
  },
  songCount: {
    type: Number,
  },
  artist: [
    
  ],
  imageUrl: { type: String },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
});

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;
