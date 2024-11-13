import User from "../models/User.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const users = await User.find({ clerkId: { $ne: currentUserId } });
    res.status(200).json({ status: true, users });
  } catch (error) {
    console.log("Error in getall users controller");
    next(error);
  }
};
