import Message from "../models/Message.js";
import Room from "../models/Room.js";

export const sendMessage = async (content, senderId, roomId) => {
  try {
    const room = await Room.findOne({ roomId });

    if (!room)
      return { status: false, message: "No room found with this roomid" };

    const message = await Message.create({
      senderId,
      message: content,
    });

    room.messages.push(message._id);
    await room.save();
    const newMessage = await Message.findById(message._id).populate("senderId");
    return { status: true, message: newMessage };
  } catch (error) {
    console.log("Error in send message controller", error.message);
  }
};
export const adminDeleteMessage = async (roomId, messageId, adminId) => {
  try {
    const message = await Message.findById(messageId);

    if (!message) return { status: false, message: "Invalid message id" };

    const room = await Room.findOne({ roomId });

    if (!room) return { status: false, message: "Room not found!" };

    if (adminId.toString() !== room.admin.toString())
      return {
        status: false,
        message: "Unauthorized! You are not an admin of this room",
      };
    console.log(roomId, messageId, adminId);
    await Message.findByIdAndUpdate(messageId, {
      message: "",
    });
    return { status: true, message: "Message deleted" };
  } catch (error) {
    console.log("Error in delete message controller", error.message);
    return { status: false, message: "Internal server error" };
  }
};
export const deleteForEveryone = async (roomId, messageId, senderId) => {
  try {
    const message = await Message.findById(messageId);

    if (!message) return { status: false, message: "Invalid message id" };

    const room = await Room.findOne({ roomId });

    if (!room) return { status: false, message: "Room not found!" };

    if (message.senderId._id.toString() !== senderId.toString())
      return {
        status: false,
        message: "Unauthorized! You are not the sender of this message",
      };
    await Message.findByIdAndUpdate(messageId, {
      message: "",
    });
    return { status: true, message: "Message deleted for everyone" };
  } catch (error) {
    console.log(
      "Error in delete for every one message controller",
      error.message
    );
  }
};

export const editMessage = async (roomId, messageId, senderId, content) => {
  try {
    const message = await Message.findById(messageId);

    if (!message) return { status: false, message: "Invalid message id" };

    const room = await Room.findOne({ roomId });

    if (!room) return { status: false, message: "Room not found!" };

    if (message.senderId._id.toString() !== senderId.toString())
      return {
        status: false,
        message: "Unauthorized! You are not the sender of this message",
      };
    await Message.findByIdAndUpdate(messageId, {
      message: content,
    });
    return { status: true, message: "Message edited" };
  } catch (error) {
    console.log("Error in delete for edit message controller", error.message);
  }
};
