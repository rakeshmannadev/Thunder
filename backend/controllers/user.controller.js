import Room from "../models/Room.js";
import User from "../models/User.js";

export const getJoinedRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ roomId: { $in: req.user.rooms } });
    res.status(200).json(rooms);
  } catch (error) {
    console.log("Error in getJoinedRooms user controller", error.message);
    next(error);
  }
};

export const getRoomMembers = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const currentUserId = req.user._id;
    const room = await Room.findOne({ roomId });

    if (!room)
      return res
        .status(404)
        .json({ status: false, message: "No room found with this roomId" });

    const participants = room.participants.filter(
      (userId) => userId !== currentUserId
    );

    res.status(200).json({ status: true, participants });
  } catch (error) {
    console.log("Error in getall users controller");
    next(error);
  }
};

export const getPublicRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().limit(10);
    res.status(200).json(rooms);
  } catch (error) {
    console.log("Error in get public rooms controller", error.message);
    next(error);
  }
};

export const joinPublicRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    if (room.visability === "public") {
      if (room.participants.includes(req.user._id)) {
        return res.status(400).json({
          status: false,
          message: "You are already a member of this room",
        });
      }
      await User.findByIdAndUpdate(req.user._id, {
        $push: { rooms: roomId },
      });
      room.participants.push(req.user._id);
      await room.save();
    }
    res.status(200).json({ status: true, message: "You have joined the room" });
  } catch (error) {
    console.log("Error in get joinRoom user controller", error.message);
    next(error);
  }
};

export const sendJoinRequest = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    if (room.visability === "private") {
      if (room.participants.includes(req.user._id)) {
        return res.status(400).json({
          status: false,
          message: "You are already a member of this room",
        });
      }

      if (room.requests.includes(req.user._id)) {
        return res.status(400).json({
          status: false,
          message: "You have already send join request",
        });
      }

      room.requests.push(req.user._id);
      await room.save();
    }
    res.status(200).json({ status: true, message: "Join request send" });
  } catch (error) {
    console.log("Error in sendJoinRequrest user controller", error.message);
    next(error);
  }
};
export const leaveRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    if (room.participants.includes(req.user._id)) {
      room.participants.pull(req.user._id);
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { rooms: roomId },
    });
    await room.save();
    res.status(200).json({ status: true, message: "You have leave the room" });
  } catch (error) {
    console.log("Error in leaveRoom user controller", error.message);
    next(error);
  }
};
export const getJoinRequests = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    res.status(200).json({ status: true, requests: room.requests });
  } catch (error) {
    console.log("Error in getjoinRequests user controller", error.message);
    next(error);
  }
};
