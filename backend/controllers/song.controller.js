import { isValidObjectId } from "mongoose";
import Song from "../models/Song.js";
import { fetchSongById } from "../services/saavn.js";

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }); // sorts descending order
    res.status(200).json({ status: true, songs });
  } catch (error) {
    console.log("Error in getAll songs controller");
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          songId: 1,
          title: 1,
          artists: 1,
          artistId: 1,
          imageUrl: 1,
          audioUrl: 1,
          albumId: 1,
        },
      },
    ]);
    res.json({ status: true, songs });
  } catch (error) {
    console.log("Error in getFeaturedSongs controller");
    next(error);
  }
};
export const getMadeForYou = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 5 },
      },
      {
        $project: {
          _id: 1,
          songId: 1,
          title: 1,
          artists: 1,
          artistId: 1,
          imageUrl: 1,
          audioUrl: 1,
          albumId: 1,
        },
      },
    ]);
    res.json({ status: true, songs });
  } catch (error) {
    console.log("Error in getMadeForYou controller");
    next(error);
  }
};
export const getTrending = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 5 },
      },
      {
        $project: {
          _id: 1,
          songId: 1,
          title: 1,
          artists: 1,
          artistId: 1,
          imageUrl: 1,
          audioUrl: 1,
          albumId: 1,
        },
      },
    ]);
    res.json({ status: true, songs });
  } catch (error) {
    console.log("Error in getTrending controller");
    next(error);
  }
};
export const getSongById = async (req, res, next) => {
  const { songId } = req.params;

  try {
    const isValidMongoDbObjectId = isValidObjectId(songId);
    if (isValidMongoDbObjectId) {
      const song = await Song.findById(songId);
      return res.status(200).json({ status: true, song });
    }
    const song = await Song.findOne({ songId });
    if (song) {
      return res.status(200).json({ status: true, song });
    }

    const fetchedSong = await fetchSongById(`/songs?ids=${songId}`);
    console.log("song from saavn api: ", fetchedSong);

    const newSong = new Song({
      songId: fetchedSong.id,
      albumId: fetchedSong.album.id,
      title: fetchedSong.name,
      artists: fetchedSong.artists,
      artistId: fetchedSong.artists.primary[0]?.id,
      imageUrl: fetchedSong.image[2].url,
      audioUrl: fetchedSong.downloadUrl[3].url,
      releaseYear: fetchedSong.year,
      releaseDate: fetchedSong.releaseDate,
      duration: fetchedSong.duration,
      playCount: fetchedSong.playCount,
      language: fetchedSong.language,
      label: fetchedSong.label,
    });
    await newSong.save();
    res.status(200).json({ status: true, song: newSong });
  } catch (error) {
    console.log("Error in getSongById controller", error.message);
    next(error);
  }
};

export const searchSong = async (req, res, next) => {
  try {
    const { query } = req.params;
    const fetchedResult = await fetch(
      `https://saavn.dev/api/search?query=${query}`
    );
    const result = await fetchedResult.json();
    console.log(result);
    res.status(200).json({ status: true, song: result.data });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server errro" });
    console.log("Error in search song controller", error.message);
    next(error);
  }
};
