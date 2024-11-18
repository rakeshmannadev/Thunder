import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: false,
    },
    name: {
      type: String,
    },

    image: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    rooms:[{type:mongoose.Schema.Types.ObjectId,ref:"Room"}],
    favorites: {
      type: Array,
      default: [],
    },
    playlists: [
     {
      playListName:{
        type:String,
        required:true,
      },
      artist:{
        type:String,
      },
      imageUrl:{
        type:String,
      },
      songs:[{type:mongoose.Schema.Types.ObjectId,ref:"Song"}]
     }
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
