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
  getPublicRooms,
  joinPublicRoom,
  leaveRoom,
  sendJoinRequest,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getCurrentUser",protectRoute,getCurrentUser);
router.get("/getJoinedRooms", protectRoute, getJoinedRooms);
router.get("/getPlaylists", protectRoute, getPlaylists);
router.post("/addToFavorite", protectRoute, addToFavorite);
router.post("/addToPlaylist", protectRoute, addToPlaylist);
router.post("/addAlbumToPlaylist", protectRoute, addAlbumToPlaylist);
router.get("/getPlaylistSongs/:id", protectRoute, getPlaylistSongs);


router.get("/getPublicRooms", getPublicRooms);
router.put("/join-public-room/:roomId", protectRoute, joinPublicRoom);
router.put("/leave-room/:roomId", protectRoute, leaveRoom);
router.put("/send-request/:roomId", protectRoute, sendJoinRequest);
router.get("/getJoinRequests/:roomId", protectRoute, getJoinRequests);
export default router;
