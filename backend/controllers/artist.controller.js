import Artist from "../models/Artist.js";

export const getArtistById = async (req, res) => {
    try {
        const {id} = req.params;
        const artist = await Artist.findOne({artistId: id}).populate(['topSongs','albums','singles']);
        if(!artist) return res.status(404).json({status:false,message:'No artist found!'});
        return res.status(200).json({artist});

    }catch (error){
        console.log(error.message);
        res.status(500).json({status:false,message:"Internal Server Error"});
    }
}