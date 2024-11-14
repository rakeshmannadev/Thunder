import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/getUsers/:roomId",protectRoute,getAllUsers);


export default router;
