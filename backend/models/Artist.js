import mongoose from 'mongoose'

const artistSchema = new mongoose.Schema({
    name:{type:String,required: true},
    artistId:{type:String,required: true},
    followers:{type:Number},
    fanCount:{type:Number},
    isVerified:{type:Boolean,default:false},
    type:{type:String},
    bio:{type:Array,default:[]},
    dob:{type:String},
    fb:{type:String},
    twitter:{type:String},
    instagram:{type:String},
    wiki:{type:String},
    image:{type:String},
    topSongs:[{type:mongoose.Schema.Types.ObjectId,ref:"Song"}], // stores songId
    albums:[{
        albumId:String,
        title:String,
        artist:String,
        imageUrl:String,
    }],
    singles:[{
        albumId:String,
        title:String,
        artist:String,
        imageUrl:String,

    }],


});

const Artist = mongoose.model("Artist", artistSchema);
export  default  Artist