import express from "express";
import {
  acceptJoinRequest,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
  rejectJoinRequest,
} from "../controllers/admin.controller.js";
import { IsAdmin, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute, IsAdmin);
router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

router.post("/accept-join-requests", acceptJoinRequest);
router.post("/reject-join-requests", rejectJoinRequest);

export default router;
