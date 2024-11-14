export interface Song{
    _id:string,
    title:string,
    artist:string,
    album:string,
    imageUrl:string,
    audioUrl:string,
    duration:number,
    createdAt:Date,
    updatedAt:Date,
}

export interface Album{
    _id:string,
    title:string,
    imageUrl:string,
    artist:string,
    releaseYear:number,
    songs:Song[]
}

