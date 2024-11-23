import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const authCheck = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // check if user is already exists
    const user = await User.findOne({ clerkId: id });

    // generate token
    let token = null;
    const secret = process.env.JWT_SECRET;
    if(user){
      token = jwt.sign({ userId: user._id }, secret);

    }

    // signup process
    if (!user) {
      const newUser = await User.create({
        clerkId: id,
        name: firstName + " " + lastName,
        image: imageUrl,
      });
      token = jwt.sign({ userId: newUser._id }, secret);

    }
    res.cookie("thunder", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV != "development",
    });
    res.status(200).json({ status: true });
  } catch (error) {
    console.log("Error in Signup controller", error.message);
    next(error);
  }
};
