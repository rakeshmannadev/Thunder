import express from 'express';
import {getArtistById} from "../controllers/artist.controller.js";

const router = express.Router();

router.get("/:id", getArtistById);
export default router;