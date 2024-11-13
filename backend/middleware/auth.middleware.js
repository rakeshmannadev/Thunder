import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export async function protectRoute(req, res, next) {
  const clerkId = req.auth.userId;

  if (!clerkId) {
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized! You must be logged in" });
  }

  const user = await User.findOne({ clerkId });

  if(!user) return res.status(404).json({status:false,message:"User not found!"});

  req.user = user;

  next();
}

export async function IsAdmin(req, res, next) {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const user = await User.findOne({
      email: currentUser.primaryEmailAddress?.emailAddress,
    });

    if (user.role !== "admin") {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized! User is not admin" });
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
}

