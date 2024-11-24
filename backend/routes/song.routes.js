import express from "express";
import { IsAdmin, protectRoute } from "../middleware/auth.middleware.js";
import { getAllSongs, getFeaturedSongs, getMadeForYou, getSongById, getTrending } from "../controllers/song.controller.js";

const router = express.Router();



router.get("/",protectRoute,IsAdmin,getAllSongs);
router.get("/featured",getFeaturedSongs);
router.get("/made-for-you",getMadeForYou);
router.get("/trending",getTrending);
router.get("/:songId",getSongById);

export default router;