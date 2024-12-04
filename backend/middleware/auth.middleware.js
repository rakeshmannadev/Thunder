import User from "../models/User.js";

export async function protectRoute(req, res, next) {
  try {
    if (!req.auth.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - you must be logged in" });
    }

    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in middleware ", error.message);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}

export async function IsAdmin(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized! User is not admin" });
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
}
