import Artist from "../models/Artist.js";
import {fetchArtistById} from "../services/saavn.js";
import Song from "../models/Song.js";


export const getArtistById = async (req, res) => {
    try {

        const {id} = req.params;

        const artist = await Artist.findOne({artistId: id}).populate('topSongs');
        if(!artist){
            const url  = `/artists/${id}`;
            const response = await fetchArtistById(url);
            const fetchedArtist = response.data;

            if(!fetchedArtist) return  res.status(404).json({ status: false, message: "Artist not found" });

            // fetching topSongs and storing into artist model
            const songIds=[];

            for(let i=0;i<fetchedArtist.topSongs.length;i++){
                const song = await Song.findOne({songId:fetchedArtist.topSongs[i].id});
                if(!song){
                 const newSong =    await Song.create({
                        songId:fetchedArtist.topSongs[i].id,
                        title:fetchedArtist.topSongs[i].name,
                        artist:fetchedArtist.topSongs[i].artists.primary[0]?.name,
                        artistId:fetchedArtist.topSongs[i].artists.primary[0]?.id,
                        imageUrl:fetchedArtist.topSongs[i].image[2]?.url,
                        audioUrl:fetchedArtist.topSongs[i].downloadUrl[3]?.url,
                        releaseYear:fetchedArtist.topSongs[i].year,
                        duration:fetchedArtist.topSongs[i].duration,
                        albumId: fetchedArtist.topSongs[i].album.id,
                    })
                songIds.push(newSong._id);
                }else{
                    songIds.push(song._id);
                }

            }

            // fetching topAlbums , singles and storing into artist model
            const albums = [];
            const singles = [];

            // store albums
            for(let i=0;i<fetchedArtist.topAlbums.length;i++){
                albums.push({
                    albumId:fetchedArtist.topAlbums[i].id,
                    title:fetchedArtist.topAlbums[i].name,
                    artist:fetchedArtist.topAlbums[i].artists.primary[0]?.name,
                    imageUrl:fetchedArtist.topAlbums[i].image[2]?.url,
                })

            }

            // store singles
            for(let i=0;i<fetchedArtist.singles.length;i++){
                singles.push({
                    albumId:fetchedArtist.singles[i].id,
                    title:fetchedArtist.singles[i].name,
                    artist:fetchedArtist.singles[i].artists.primary[0]?.name,
                    imageUrl:fetchedArtist.singles[i].image[2]?.url,
                })
            }

            const newArtist = await Artist.create({
                name:fetchedArtist.name,
                artistId: fetchedArtist.id,
                followers: fetchedArtist.followerCount,
                fanCount: parseInt(fetchedArtist.fanCount),
                isVerified: fetchedArtist.isVerified,
                type: fetchedArtist.dominantType,
                bio: fetchedArtist.bio,
                dob:fetchedArtist.dob,
                fb:fetchedArtist.fb,
                twitter:fetchedArtist.twitter,
                wiki:fetchedArtist.wiki,
                image:fetchedArtist.image[2].url,
                topSongs:songIds,
                albums,
                singles,

            })
            const updatedArtist = await Artist.findById(newArtist._id).populate('topSongs');

            return  res.status(200).json({status:true,artist:updatedArtist});
        }
       res.status(200).json({status:true,artist});

    }catch (error){
        console.log(error.message);
        res.status(500).json({status:false,message:"Internal Server Error"});
    }
}