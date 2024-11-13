import express from "express";
import { IsAdmin, protectRoute } from "../middleware/auth.middleware.js";
import { getAllSongs, getFeaturedSongs, getMadeForYou, getTrending } from "../controllers/song.controller.js";

const router = express.Router();



router.get("/",protectRoute,IsAdmin,getAllSongs);
router.get("/featured",getFeaturedSongs);
router.get("/made-for-you",getMadeForYou);
router.get("/trending",getTrending);

export default router;