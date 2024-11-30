import express from "express";
import {
  fetchAlbumAndSaveToDb,
  getAlbumById,
  getAllAlbums,
} from "../controllers/album.controller.js";

const router = express.Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);
router.post("/fetchAlbumAndSave/:albumId", fetchAlbumAndSaveToDb);
export default router;
