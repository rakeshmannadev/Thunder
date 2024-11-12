import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modarators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: [] },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
