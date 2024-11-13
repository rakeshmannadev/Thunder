import Album from "../models/Album.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json({ status: true, albums });
  } catch (error) {
    console.log("Error in get all albums controller");
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId).populate("songs");
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
