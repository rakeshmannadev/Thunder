import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYou,
  getSongById,
  getTrending,
  searchSong,
} from "../controllers/song.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYou);
router.get("/trending", getTrending);
router.get("/:songId", getSongById);
router.get("/searchSong/:query", searchSong);

export default router;
