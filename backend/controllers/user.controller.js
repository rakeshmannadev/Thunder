import Room from "../models/Room.js";
import User from "../models/User.js";
import mongoose from "mongoose";
export const getJoinedRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ _id: { $in: req.user.rooms } });
    res.status(200).json({ rooms });
  } catch (error) {
    console.log("Error in getJoinedRooms user controller", error.message);
    next(error);
  }
};

export const getPlaylists = async (req, res, next) => {
  try {
    res.status(200).json({ playlists: req.user.playlists });
  } catch (error) {
    console.log("Error in getPlaylists user controller", error.message);
    next(error);
  }
};

export const getPublicRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().limit(10);
    res.status(200).json({ rooms });
  } catch (error) {
    console.log("Error in get public rooms controller", error.message);
    next(error);
  }
};

export const joinPublicRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);

    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    if (room.visability === "public") {
      if (room.participants.includes(req.user._id)) {
        return res.status(400).json({
          status: false,
          message: "You are already a member of this room",
        });
      }
      await User.findByIdAndUpdate(req.user._id, {
        $push: { rooms: roomId },
      });
      room.participants.push(req.user._id);
      await room.save();
    }
    res
      .status(200)
      .json({ status: true, message: "You have joined the room", room });
  } catch (error) {
    console.log("Error in get joinRoom user controller", error.message);
    next(error);
  }
};

export const sendJoinRequest = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    if (room.visability === "private") {
      if (room.participants.includes(req.user._id)) {
        return res.status(400).json({
          status: false,
          message: "You are already a member of this room",
        });
      }

      if (room.requests.includes(req.user._id)) {
        return res.status(400).json({
          status: false,
          message: "You have already send join request",
        });
      }

      room.requests.push(req.user._id);
      await room.save();
    }
    res.status(200).json({ status: true, message: "Join request send" });
  } catch (error) {
    console.log("Error in sendJoinRequrest user controller", error.message);
    next(error);
  }
};
export const leaveRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    if (room.participants.includes(req.user._id)) {
      room.participants.pull(req.user._id);
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { rooms: roomId },
    });
    await room.save();
    res.status(200).json({ status: true, message: "You have leave the room" });
  } catch (error) {
    console.log("Error in leaveRoom user controller", error.message);
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.log("Error in get current user controller", error.message);
  }
};

export const addToFavorite = async (req, res, next) => {
  try {
    const { songId, playListName, imageUrl, artist } = req.body;
    const user = req.user;

    let favoritesPlayList = user.playlists.find(
      (playlist) => playlist.playListName === "Favorites"
    );

    if (!favoritesPlayList) {
      favoritesPlayList = {
        playListName,
        artist,
        imageUrl,
        songs: [],
      };
      user.playlists.push(favoritesPlayList);
    }

    if (favoritesPlayList.songs.includes(songId)) {
      return res
        .status(400)
        .json({ status: false, message: "Song is already in favorites!" });
    }
    favoritesPlayList.songs.push(songId);

    await user.save();
    res.status(200).json({ status: true, message: "Song added to favorites" });
  } catch (error) {
    console.log("Error in addtoFavorite controller", error.message);
    next(error);
  }
};

export const getPlaylistSongs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const songs = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(user._id) } }, // Match user by userId
      { $unwind: "$playlists" }, // Decompose playlists array
      { $match: { "playlists._id": new mongoose.Types.ObjectId(id) } }, // Match specific playlist by _id
      {
        $lookup: {
          from: "songs", // Collection name for songs
          localField: "playlists.songs",
          foreignField: "_id",
          as: "playlists.songs",
        },
      },
      { $project: { playlists: 1 } }, // Keep only the matched playlist
    ]);

    res.status(200).json({ status: true, songs });
  } catch (error) {
    console.log("Error in getPlaylistSongs", error.message);
    next(error);
  }
};
export const addToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, artist, songId, playListName, imageUrl } = req.body;

    const user = req.user;

    if (!playlistId) {
      if (!playListName || !artist || !songId)
        return res
          .status(400)
          .json({ status: false, message: "Please provide all details" });
      const playlist = await User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $push: {
            playlists: { playListName, imageUrl, artist, songs: [songId] },
          },
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ status: true, message: "Album added to playlist", playlist });
    }

    user.playlists.map((playlist) => {
      if (playlist._id.toString() === playlistId.toString()) {
        if (playlist.songs.includes(songId)) {
          return res.status(400).json({
            status: false,
            message: "Song is already in this playlist",
          });
        }
        playlist.songs.push(songId);
      }
    });

    await user.save();
    return res
      .status(200)
      .json({ status: true, message: "Song added to playlist" });
  } catch (error) {
    console.log("Error in addToPlaylist controller", error.message);
    next(error);
  }
};

export const addAlbumToPlaylist = async (req, res, next) => {
  try {
    const { playListName, imageUrl, artist, albumId, songs } = req.body;

    const playlist = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $push: {
          playlists: { playListName, imageUrl, artist, albumId, songs },
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ status: true, message: "Album added to playlist", playlist });
  } catch (error) {
    console.log("Error in addAlbumToPlaylist controller", error.message);
    next(error);
  }
};
