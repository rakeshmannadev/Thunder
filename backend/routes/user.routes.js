import express from "express";
import {
  addAlbumToPlaylist,
  addToFavorite,
  addToPlaylist,
  getCurrentUser,
  getJoinedRooms,
  getJoinRequests,
  getPlaylists,
  getPlaylistSongs,
  getRooms,
  joinPublicRoom,
  leaveRoom,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.get("/getCurrentUser", getCurrentUser);
router.get("/getJoinedRooms", getJoinedRooms);
router.get("/getPlaylists", getPlaylists);
router.post("/addToFavorite", addToFavorite);
router.post("/addToPlaylist", addToPlaylist);
router.post("/addAlbumToPlaylist", addAlbumToPlaylist);
router.get("/getPlaylistSongs/:id", getPlaylistSongs);

router.post("/getJoinRequests", getJoinRequests);
router.get("/getRooms", getRooms);
router.put("/join-public-room/:roomId", joinPublicRoom);
router.put("/leave-room/:roomId", leaveRoom);

export default router;
