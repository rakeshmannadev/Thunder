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

export interface Room{
    _id:string,
    roomId:string,
    visability:string,
    roomName:string,
    image:string,
    admin:string,
    modarators:any[],
    requests:any[],
    participants:any[],
    messages:any[]
}

export interface Playlist{
    _id:string,
    playListName:string,
    imageUrl:string,
    artist:string,
    songs:Song[],

}