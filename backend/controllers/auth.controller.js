import generateTokenAndSetCookie from "../helper/generateToken.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { email, name, password, gender } = req.body;
    if (!email || !name || !password || !gender)
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "user is already exist" });
    }

    // hash the password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // getting avatar url from api
    let avatar;
    if (gender === "male") {
      avatar = `https://avatar.iran.liara.run/public/boy/?username=${name}`;
    } else {
      avatar = `https://avatar.iran.liara.run/public/girl/?username=${name}`;
    }

    //saving new user to database
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      gender,
      image: avatar,
    });
    let token = null;
    if (newUser) {
      token = generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
    }
    res.status(201).json({
      status: true,
      accessToken: token,
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: false, message: "User not found,create an account" });
    const isMatch = await bcrypt.compare(password, user?.password || "");

    if (!user || !isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid username or password " });
    }

    //res.status(200).json({message:"Login successfull"})
    const token = generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      status: true,
      accessToken: token,
      user,
      message: "Login successfull",
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("thunder");
    res
      .status(200)
      .json({ status: true, accessToken: null, message: "Logout successfull" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
