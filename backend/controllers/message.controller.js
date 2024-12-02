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
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message)
      return res
        .status(404)
        .json({ status: false, message: "Invalid message id" });

    if (message.senderId !== req.user._id)
      return res.status(401).json({
        status: false,
        message: "Unauthorized You are not the sender of this message",
      });

    await Message.findByIdAndDelete(id);
    res.status(200).json({ status: true, message: "Message deleted" });
  } catch (error) {
    console.log("Error in delete message controller");
    next(error);
  }
};
