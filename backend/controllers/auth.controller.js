import User from "../models/User.js";


export const authCheck = async (req, res, next) => {
    try {
      const { id, firstName, lastName, imageUrl } = req.body;
  
      // check if user is already exists
      const user = await User.findOne({ clerkId: id });
      // signup process
      if (!user) {
        await User.create({
          clerkId: id,
          name: firstName + " " + lastName,
          image: imageUrl,
        });
      }
      res.status(200).json({ status: true });
    } catch (error) {
      console.log("Error in Signup controller");
      next(error);
    }
  };