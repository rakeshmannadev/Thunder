import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
      required: true,
    },
    visability: {
      type: String,
      default: "public",
    },
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
    requests: [
      {
        user: {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          userName: {
            type: String,
          },
        },
        status: {
          type: String,
        },
        room: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
      },
    ],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: [] },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
