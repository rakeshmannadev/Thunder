import { fetchPlaylistById } from "../services/saavn.js";
import Song from "../models/Song.js";
import Playlist from "../models/Playlist.js";

export const getPlayListById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ status: false, message: "No playlist id provided" });

    
    res.status(200).json({ status: true, playlist: newPlaylist });
  } catch (error) {
    console.log("Error in playlist controller", error.message);
    next(error);
  }
};
