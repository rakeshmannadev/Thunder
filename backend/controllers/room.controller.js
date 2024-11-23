import generateRandomCode from "../helper/generateRoomId.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

export const createRoom = async (req, res, next) => {
  try {
    const { roomName } = req.body;
    if (!roomName) {
      return res.status(401).json({
        status: false,
        message: "Please provide room name",
      });
    }
    // const { imageFile } = req.files;

    // const imageUrl = await uploadeFiles(imageFile);
    const roomId = generateRandomCode(8);
    const room = await Room.create({
      roomId,
      roomName,
      admin: req.user._id,
      participants: req.user._id,
    });
    if (room) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { rooms: room._id },
      });
    }
    res.status(201).json({ status: true, message: "Room is created", room });
  } catch (error) {
    console.log("Error in create room controller");
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room)
      return res.status(404).json({ status: false, message: "Room not found" });

    if (req.user.role !== "admin") {
      return res
        .status(401)
        .json({ status: false, message: "You are not an admin." });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { rooms: roomId },
    });
    await Room.findOneAndDelete({ roomId });
    res.status(200).json({ status: true, message: "Room is deleted" });
  } catch (error) {
    console.log("Error in deleteRoom controller");
    next(error);
  }
};

export const acceptJoinRequests = async (req, res, next) => {
  try {
    const { roomId, userId } = req.body;
    if (!roomId || !userId)
      return res
        .status(401)
        .json({ status: false, message: "Please provide roomId and userId" });

    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({
        status: false,
        message: "No room is available with this roomid",
      });

    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ status: false, message: "Only room admin can do that" });

    if (room.participants.includes(userId)) {
      return res.status(401).json({
        status: false,
        message: "User is already a member of this group",
      });
    }

    room.participants.push(userId);
    const otherUser = await User.findById(userId);
    if (otherUser) {
      otherUser.rooms.push(roomId);
    }
    await otherUser.save();
    await room.save();
  } catch (error) {
    console.log("Error in accept request controller");
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { userId, roomId } = req.body;

    if (!userId || !roomId)
      return res
        .status(400)
        .json({ status: false, message: "No userid or roomid provided" });

    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({
        status: false,
        message: "No room is available with this roomid",
      });

    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ status: false, message: "Only room admin can do that" });

    const otherUser = await User.findById(userId);
    if (otherUser) {
      otherUser.rooms.pull(roomId);
    }
    room.participants.pull(userId);

    await otherUser.save();
    await room.save();
    res.status(200).json({ status: true, message: "Member removed from room" });
  } catch (error) {
    console.log("Error in remove member controller");
    next(error);
  }
};

export const addModarator = async (req, res, next) => {
  try {
    const { userId, roomId } = req.body;
    if (!userId || !roomId)
      return res
        .status(400)
        .json({ status: false, message: "No userid or roomid provided" });

    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({
        status: false,
        message: "No room is available with this roomid",
      });

    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ status: false, message: "Only room admin can do that" });

    if (room.modarators.includes(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "Member is already a modarator" });
    }
    room.modarators.push(userId);
    await room.save();
  } catch (error) {
    console.log("Error in add modarator controller");
    next(error);
  }
};
export const removeModarator = async (req, res, next) => {
  try {
    const { userId, roomId } = req.body;
    if (!userId || !roomId)
      return res
        .status(400)
        .json({ status: false, message: "No userid or roomid provided" });

    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({
        status: false,
        message: "No room is available with this roomid",
      });

    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ status: false, message: "Only room admin can do that" });

    if (room.modarators.includes(userId)) {
      room.modarators.pull(userId);
      await room.save();
    }
    res
      .status(200)
      .json({ status: true, message: "Member is removed from modarator" });
  } catch (error) {
    console.log("Error in remove modarator controller");
    next(error);
  }
};
export const getRoomMembers = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId }).populate("participants");

    if (!room)
      return res
        .status(404)
        .json({ status: false, message: "No room found with this roomId" });

    res.status(200).json({ status: true, participants: room.participants });
  } catch (error) {
    console.log("Error in getall users controller", error.message);
    next(error);
  }
};

export const getActiveUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    const users = await User.find(
      { _id: { $in: userIds } },
      { _id: 1, name: 1, role: 1 }
    );
    res.status(200).json({ status: true, users });
  } catch (error) {
    console.log("Error in getActiveUsers", error.message);
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    if (!roomId)
      return res
        .status(400)
        .json({ status: false, message: "No roomId provided" });

    const room = await Room.findOne({ roomId });
    res.status(200).json({ status: true, room });
  } catch (error) {
    console.log("Error in getRoombyId controller", error.message);
    next(error);
  }
};
