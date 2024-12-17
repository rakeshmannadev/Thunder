import Album from "../models/Album.js";
import Song from "../models/Song.js";
import { fetchAlbum, fetchSongById } from "../services/saavn.js";

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
    if (!album) {
      const response = await fetchAlbum(albumId, "/albums");
      const fetchedAlbum = response.data;

      let songs = [];

      for (let i = 0; i < fetchedAlbum.songs?.length; i++) {
        const song = await fetchSongById(`/songs/${fetchedAlbum.songs[i].id}`);

        if (song) {
          const newSong = await Song.create({
            songId: song.id,
            title: song.name,
            artist: song.artists?.primary[0]?.name,
            artistId: song.artists?.primary[0]?.id,
            imageUrl: song.image[2].url,
            audioUrl: song.downloadUrl[3].url,
            releaseYear: song.releaseDate,
            duration: song.duration,
            albumId: song.album.id,
          });
          songs.push(newSong._id);
        }
      }

      const newAlbum = new Album({
        albumId: fetchedAlbum.id,
        title: fetchedAlbum.name,
        artist: fetchedAlbum.artists?.primary[0]?.name,
        artistId:fetchedAlbum.artists?.primary[0]?.id,
        imageUrl: fetchedAlbum.image[2].url,
        releaseYear: fetchedAlbum.year,
        songs,
      });
      await newAlbum.save();
      const albumWithSongs = await Album.findById(newAlbum._id).populate(
        "songs"
      );
      return res.status(200).json({ status: true, album: albumWithSongs });
    }
    res.status(200).json({ status: true, album });
  } catch (error) {
    console.log("Error in get album by id controller", error.message);
    next(error);
  }
};

