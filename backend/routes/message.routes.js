import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/sendMessage",protectRoute,sendMessage);
router.delete("/deleteMessage/:id",protectRoute,deleteMessage);


export default router;