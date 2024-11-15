import express from "express";
import { getRoomMembers, joinRoom } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/getRoomMembers/:roomId",protectRoute,getRoomMembers);

router.get("/getPublicRooms",getPublicRooms);
router.put("/join-room/:roomId",protectRoute,joinRoom);
router.put("/send-request/:roomId",protectRoute,sendJoinRequest);

export default router;
