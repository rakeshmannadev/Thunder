import mongoose from "mongoose";

const albumSchema = mongoose.Schema(
  {
    albumId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
      artistId:{type:String},
    imageUrl: {
      type: String,
      required: false,
    },
    releaseYear: {
      type: String,
    },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);

const Album = mongoose.model("Album", albumSchema);
export default Album;
