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

    const playlist = await Playlist.findOne({ playlistId: id });

    if (playlist) return res.status(200).json({ status: true, playlist });

    const response = await fetchPlaylistById("/api/playlists");
    const fetchedPlaylist = response.data;

    if (!fetchedPlaylist)
      return res
        .status(404)
        .json({ status: false, message: "No playlist found" });

    // Store songs in Song model
    const songIds = [];
    for (let i = 0; i < fetchedPlaylist.songs; i++) {
      const song = await Song.findOne({ songId: fetchedPlaylist.songs[i].id });
      if (!song) {
        const newSong = new Song({
          songId: fetchedPlaylist.songs[i].id,
          title: fetchedPlaylist.songs[i].name,
          artist: fetchedPlaylist.songs[i].artists.primary[0].name,
          artistId: fetchedPlaylist.songs[i].artists.primary[0].id,
          imageUrl: fetchedPlaylist.songs[i].image[2].url,
          audioUrl: fetchedPlaylist.songs[i].downloadUrl[3].url,
          releaseYear: fetchedPlaylist.songs[i].year,
          duration: fetchedPlaylist.songs[i].duration,
          albumId: fetchedPlaylist.songs[i].album.id,
        });
        await newSong.save();
        songIds.push(newSong._id);
      } else {
        songIds.push(song._id);
      }
    }

    // store artists in temp artist array

    const artists = [];
    for (let i = 0; i < fetchedPlaylist.artists.length; i++) {
      const newArtist = {
        artistId: fetchedPlaylist.artists[i].id,
        name: fetchedPlaylist.artists[i].name,
        role: fetchedPlaylist.artists[i].role,
        image: fetchedPlaylist.artists[i].image[2].url,
        type: fetchedPlaylist.artists[i].type,
      };
      artists.push(newArtist);
    }

    // Store playlist in Playlist model
    const newPlaylist = new Playlist({
      playlistId: fetchedPlaylist.id,
      playlistName: fetchedPlaylist.name,
      description: fetchedPlaylist.description,
      year: fetchedPlaylist.year,
      songCount: fetchedPlaylist.songCount,
      artists,
      image: fetchedPlaylist.image[2].url,
      songs: songIds,
    });
    await newPlaylist.save();
    res.status(200).json({ status: true, playlist: newPlaylist });
  } catch (error) {
    console.log("Error in playlist controller", error.message);
    next(error);
  }
};
