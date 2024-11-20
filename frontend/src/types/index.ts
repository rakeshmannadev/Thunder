export interface Song{
    _id:string,
    title:string,
    artist:string,
    album:string,
    albumId:string,
    imageUrl:string,
    audioUrl:string,
    duration:number,
    createdAt:string,
    updatedAt:Date,
}

export interface Album{
    _id:string,
    albumId:string,
    title:string,
    imageUrl:string,
    artist:string,
    releaseYear:string,
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
    albumId:string |any,
    songs:Song[] |any[],

}
export interface User{
    _id:string,
    clerkId:string,
    name:string,
    image:string,
    role:string,
    playlists:Array<Playlist>,
    followers:Array<any>,
    following:Array<any>,

}

