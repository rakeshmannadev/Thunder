import generateRandomCode from "../helper/generateRoomId.js";
import { uploadeFiles } from "../helper/uploadeFIleToCloudinary.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

export const createRoom = async (req, res, next) => {
  try {
    const { roomName, visability } = req.body;
    if (!roomName || !visability) {
      return res.status(401).json({
        status: false,
        message: "Please provide all details",
      });
    }
    const { imageFile } = req.files;
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadeFiles(imageFile);
    }
    const roomId = generateRandomCode(8);
    const room = await Room.create({
      roomId,
      roomName,
      visability,
      image: imageUrl ? imageUrl : "",
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
    console.log("Error in create room controller", error.message);
    next(error);
  }
};

export const deleteRoom = async (userId, roomId) => {
  try {
    const room = await Room.findById(roomId);

    if (!room) return { status: false, message: "Room not found" };

    if (userId.toString() !== room.admin.toString()) {
      return { status: false, message: "You are not an admin." };
    }
    await User.findByIdAndUpdate(userId, {
      $pull: { rooms: roomId },
    });
    await Room.findByIdAndDelete(roomId);
    return { status: true, message: "Room is deleted", room };
  } catch (error) {
    throw new Error(error);
  }
};

export const removeMember = async (userId, roomId, memberId) => {
  try {
    if (!userId || !roomId)
      return { status: false, message: "No userid or roomid provided" };

    const room = await Room.findById(roomId);
    if (!room)
      return {
        status: false,
        message: "No room is available with this roomid",
      };

    if (room.admin.toString() !== userId.toString())
      return { status: false, message: "Only room admin can do that" };

    const member = await User.findById(memberId);
    if (member) {
      member.rooms.pull(roomId);
    }
    room.participants.pull(memberId);

    Promise.all([member.save(), room.save()]);
    return { status: true, room };
  } catch (error) {
    console.log(error.message);
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
