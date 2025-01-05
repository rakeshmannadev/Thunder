import Playlist from "../models/Playlist.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { isObjectIdOrHexString } from "mongoose";

import Song from "../models/Song.js";
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
    const playlists = await Playlist.find({ _id: { $in: req.user.playlists } });

    res.status(200).json({ playlists });
  } catch (error) {
    console.log("Error in getPlaylists user controller", error.message);
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ _id: { $nin: req.user.rooms } }).limit(10);
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
export const getJoinRequests = async (req, res, next) => {
  try {
    const { roomIds } = req.body;

    const room = await Room.find({
      _id: { $in: roomIds },
      requests: { $ne: [] },
      "requests.status": "pending",
    }).populate("requests.room");

    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    let requests = [];

    room.forEach((room) => {
      requests.push({
        requests: room.requests,
      });
    });

    res
      .status(200)
      .json({ status: true, requests: requests[0]?.requests || [] });
  } catch (error) {
    console.log("Error in getjoinRequests user controller", error.message);
    next(error);
  }
};
export const leaveRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    if (room.participants.includes(req.user._id)) {
      room.participants.pull(req.user._id);
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { rooms: roomId },
    });
    await room.save();
    res.status(200).json({ status: true, message: "You have left the room" });
  } catch (error) {
    console.log("Error in leaveRoom user controller", error.message);
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({ status: true, user: req.user });
  } catch (error) {
    console.log("Error in get current user controller", error.message);
  }
};

export const addToFavorite = async (req, res, next) => {
  try {
    const { songId, playListName, imageUrl, artist } = req.body;
    const user = req.user;
    const playlists = await Playlist.find({
      _id: { $in: req.user.playlists },
    });

    let favoritesPlayList = playlists.find(
      (playlist) => playlist.playlistName === "Favorites"
    );

    if (!favoritesPlayList) {
      const favoritesPlayList = await Playlist.create({
        playlistName: playListName,
        artist,
        imageUrl,
        songs: [songId],
      });

      user.playlists.push(favoritesPlayList._id);
      await user.save();
      return res.status(201).json({
        status: true,
        message: "Favorite playlist created",
        playlist: favoritesPlayList,
      });
    }

    if (favoritesPlayList.songs.includes(songId)) {
      return res
        .status(400)
        .json({ status: false, message: "Song is already in favorites!" });
    }

    favoritesPlayList.songs.push(songId);
    let flag = false;
    for (let j = 0; j < favoritesPlayList.artist.length; j++) {
      for (let i = 0; i < artist.length; i++) {
        if (favoritesPlayList.artist[j].id == artist[i].id) {
          flag = true;
        }

      }
    }

    if(!flag){
      favoritesPlayList.artist.push(artist[0]);
    }

    await favoritesPlayList.save();

    res.status(200).json({ status: true, message: "Song added to favorites" });
  } catch (error) {
    console.log("Error in addtoFavorite controller", error.message);
    next(error);
  }
};

export const getPlaylistSongs = async (req, res, next) => {
  try {
    const { id } = req.params;
    let songs = null;
    if (isObjectIdOrHexString(id)) {
      songs = await Playlist.findById(id).populate("songs");
    } else {
      songs = await Playlist.findOne({ playlistId: id }).populate("songs");
    }

    if (songs) return res.status(200).json({ status: true, songs });

    const response = await fetch(` https://saavn.dev/api/playlists?id=${id}`);
    const result = await response.json();
    const fetchedPlaylist = result.data;

    if (!result.success) {
      return res
        .status(404)
        .json({ status: false, message: "No playlist found" });
    }

    // Store songs in Song model
    const songIds = [];
    for (let i = 0; i < fetchedPlaylist.songs.length; i++) {
      const song = await Song.findOne({ songId: fetchedPlaylist.songs[i].id });

      if (!song) {
        const newSong = new Song({
          songId: fetchedPlaylist.songs[i].id,
          title: fetchedPlaylist.songs[i].name,
          artists: fetchedPlaylist.songs[i].artists,
          artistId: fetchedPlaylist.songs[i].artists.primary[0].id,
          imageUrl: fetchedPlaylist.songs[i].image[2]?.url,
          audioUrl: fetchedPlaylist.songs[i].downloadUrl[3]?.url,
          releaseYear: fetchedPlaylist.songs[i].year,
          duration: fetchedPlaylist.songs[i].duration,
          albumId: fetchedPlaylist.songs[i].album.id,
        });
        await newSong.save();
        console.log("song saved");
        songIds.push(newSong._id);
      } else {
        songIds.push(song._id);
      }
    }

    // Store playlist in Playlist model
    const newPlaylist = new Playlist({
      playlistId: fetchedPlaylist.id,
      playlistName: fetchedPlaylist.name,
      description: fetchedPlaylist.description,
      year: fetchedPlaylist.year,
      songCount: fetchedPlaylist.songCount,
      artist: fetchedPlaylist.artists,
      imageUrl: fetchedPlaylist.image[2]?.url,
      songs: songIds,
    });
    await newPlaylist.save();

    const newSongs = await Playlist.findById(newPlaylist._id).populate("songs");
    res.status(200).json({ status: true, songs: newSongs });
  } catch (error) {
    console.log("Error in getPlaylistSongs", error.message);
    next(error);
  }
};
export const addToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, artist, songId, playListName, imageUrl } = req.body;

    const user = req.user;
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      if (!playListName || !artist || !songId)
        return res
          .status(400)
          .json({ status: false, message: "Please provide all details" });
      const playlist = new Playlist({
        playlistName: playListName,
        artist,
        imageUrl,
        songs: [songId],
      });
      await playlist.save();
      user.playlists.push(playlist._id);
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Playlist created",
        playlist,
      });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({
        status: false,
        message: "Song is already in this playlist",
      });
    }
    playlist.songs.push(songId);

    await playlist.save();
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
    const { playListName, imageUrl, artist, albumId, playlistId, songs } =
      req.body;
    const user = req.user;
    const playlist = new Playlist({
      playlistName: playListName,
      imageUrl,
      playlistId,
      albumId,
      artist: artist,
      songs,
    });

    user.playlists.push(playlist._id);
    Promise.all[(playlist.save(), user.save())];
    res
      .status(200)
      .json({ status: true, message: "Album added to playlist", playlist });
  } catch (error) {
    console.log("Error in addAlbumToPlaylist controller", error.message);
    next(error);
  }
};
