import express from 'express';
import { getPlayListById } from '../controllers/playlist.controller.js';



const router = express.Router();

router.get("/:id", getPlayListById);
export default router;