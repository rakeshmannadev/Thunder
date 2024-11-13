import generateRandomCode from "../helper/generateRoomId.js";
import { uploadeFiles } from "../helper/uploadeFIleToCloudinary.js";
import Room from "../models/Room.js";

export const createRoom = async (req, res, next) => {
  try {
    const { roomName } = req.body;
    if (!roomName || !req.files) {
      return res.status(401).json({
        status: false,
        message: "Please provide all files and details",
      });
    }
    const { imageFile } = req.files;

    const imageUrl = await uploadeFiles(imageFile);
    const roomId = generateRandomCode(8);
    const room = await Room.create({
      roomId,
      roomName,
      image: imageUrl,
      admin: req.user._id,
    });
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

    if (room.admin != req.user._id) {
      return res
        .status(401)
        .json({ status: false, message: "You are not an admin." });
    }

    await Room.findOneAndDelete({ roomId });
    res.status(200).json({ status: true, message: "Room is deleted" });
  } catch (error) {
    console.log("Error in deleteRoom controller");
    next(error);
  }
};

export const sendJoinRequest = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room)
      return res.status(404).json({ status: false, message: "Room not found" });

    await Room.findOneAndUpdate(
      { roomId },
      {
        $push: { requests: req.user._id },
      }
    );

    res.status(200).json({ status: true, message: "Join request is send" });
  } catch (error) {
    console.log("Error in join Request controller");
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

    if (room.admin !== req.user._id)
      return res
        .status(401)
        .json({ status: false, message: "Only room admin can do that" });

    if (room.participants.includes(userId)) {
      return res.status(401).json({
        status: false,
        message: "You are already a member of this group",
      });
    }

    room.participants.push(userId);
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

    if (room.admin !== req.user._id)
      return res
        .status(401)
        .json({ status: false, message: "Only room admin can do that" });

    room.participants.pull(userId);

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

    if (room.admin !== req.user._id)
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

    if (room.admin !== req.user._id)
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
