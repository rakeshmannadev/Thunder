import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.thunder;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized access- no token provied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ error: "Unauthorized access- invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

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
