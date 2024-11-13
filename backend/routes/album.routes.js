import express from "express";

const router = express.Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);

export default router;
