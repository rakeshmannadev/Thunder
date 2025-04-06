import jwt from "jsonwebtoken";
const generateTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("thunder", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // this will prevent cookie from being accessed by client side script
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "strict", /// this will prevent csrf attack
  });
  return token;
};
export default generateTokenAndSetCookie;
