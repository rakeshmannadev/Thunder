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
      {type:mongoose.Schema.Types.ObjectId,ref:"Playlist"}
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
