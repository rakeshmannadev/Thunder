import Album from "../models/Album.js";
import Song from "../models/Song.js";
import { fetchAlbum, fetchSong } from "../services/saavn.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          albumId: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
        },
      },
    ]);
    res.status(200).json({ status: true, albums });
  } catch (error) {
    console.log("Error in get all albums controller");
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findOne({ albumId }).populate("songs");
    if (!album)
      return res
        .status(400)
        .json({ status: false, message: "Album not found" });
    res.status(200).json({ status: true, album });
  } catch (error) {
    console.log("Error in get album by id controller");
    next(error);
  }
};

export const fetchAlbumAndSaveToDb = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    const response = await fetchAlbum(albumId, "/albums");
    const album = response.data;
    let songs = [];

    for (let i = 0; i < album.songs?.length; i++) {
      const song = await fetchSong(album.songs[i].id);
      if (song) {
        const newSong = await Song.create({
          songId: song.id,
          title: song.name,
          artist: song.artists.primary[0].name,
          imageUrl: song.image[2].url,
          audioUrl: song.downloadUrl[3].url,
          releaseYear: song.releaseDate,
          duration: song.duration,
          albumId: song.album.id,
        });
        songs.push(newSong._id);
      }
    }

    const newAlbum = await Album.create({
      albumId: album.id,
      title: album.name,
      artist: album.artists.primary[0].name,
      imageUrl: album.image[2].url,
      releaseYear: album.year,
      songs,
    });
    res.status(200).json({ status: true, album: newAlbum });
  } catch (error) {
    console.log(
      "Error in fetchAlbumAndSaveToDb album controller",
      error.message
    );
    next(error);
  }
};
