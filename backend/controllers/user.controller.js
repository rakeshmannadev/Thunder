import Room from "../models/Room.js";

export const getAllUsers = async (req, res, next) => {
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
