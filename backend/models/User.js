import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },

    image: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],

    playlists: [
      {
        playListName: {
          type: String,
          required: true,
        },
        albumId: {
          type: String,
          default: null,
        },
        artist: {
          type: String,
        },
        imageUrl: {
          type: String,
        },
        songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
      },
    ],
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
