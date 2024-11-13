import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptJoinRequests,
  addModarator,
  createRoom,
  deleteRoom,
  removeMember,
  removeModarator,
} from "../controllers/room.controller.js";

const router = express.Router();

router.post("/create-room", protectRoute, createRoom);
router.delete("/delete-room/:roomId", protectRoute, deleteRoom);
router.put("/accept-request/", protectRoute, acceptJoinRequests);
router.delete("/remove-member/", protectRoute, removeMember);
router.put("/add-modarator", protectRoute, addModarator);
router.delete("/remove-modarator", protectRoute, removeModarator);

export default router;
