import Song from "../models/Song.js";

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
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
          albumId:1
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
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
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
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
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
  const {songId} = req.params;
  try {
    const song = await Song.findById(songId);
    if(!song){
      return res.status(404).json({status:false,message:"Song not found"});
    }
    res.status(200).json({status:true,song});
  } catch (error) {
    console.log("first error in getSongById controller",error.message);
    next(error);
  }
}