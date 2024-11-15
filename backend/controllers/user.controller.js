import Room from "../models/Room.js";

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

export const joinRoom = async (req, res, next) => {
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

      if(room.requests.includes(req.user._id)){
        return res.status(400).json({
          status: false,
          message: "You have already send join request",
        });
      }

      room.requests.push(req.user._id);
      await room.save();
    }
    res.status(200).json({status:true,message:"Join request send"})
  } catch (error) {
    console.log("Error in sendJoinRequrest user controller", error.message);
    next(error);
  }
};
