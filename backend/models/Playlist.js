import mongoose from "mongoose";
const playlistSchema = mongoose.Schema({
  playlistId: {
    type: String,
    required: true,
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
  artists: [
    {
      artistId: { type: String },
      name: { type: String },
      role: { type: String },
      image: { type: String },
      type: { type: String },
    },
  ],
  image: { type: String },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
});

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;
