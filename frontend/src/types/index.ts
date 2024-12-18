export interface Song {
  _id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchedSong {
  album: { id: string; name: string };
  artists: { primary: { name: string }[] };
  id: string;
  duration: number;

  image: { quality: string; url: string }[];

  name: string;

  year: string;
}
export interface SongRequest {
  _id: string;
  title: string;
  albumId: string;
  imageUrl: string;
  userName: string;
  userId: string;
}

export interface Album {
  _id: string;
  albumId: string;
  title: string;
  imageUrl: string;
  artist: string;
  releaseYear: string;
  songs: Song[];
}
export interface Artist{
  _id: string;
  name: string;
  artistId: string;
  followers: number;
  fanCount: number;
  isVerified: boolean;
  type:string;
  bio:[];
  dob: string;
  fb:string,
  twitter:string,
  instagram:string,
  wiki:string,
  image: string;
  topSongs:Song[];
  albums:Album[];
  singles:Album[];

}
export interface Room {
  _id: string;
  roomId: string;
  visability: string;
  roomName: string;
  image: string;
  admin: string;
  modarators: any[];
  requests: Requests[];
  participants: string[];
  messages: Message[];
}
export interface Message {
  _id: string;
  senderId: User;
  message: string;
}
export interface Playlist {
  _id: string | any;
  playListName: string;
  imageUrl: string;
  artist: string;
  albumId: string | any;
  songs: Song[] | any[];
}
export interface User {
  _id: string;
  email:string;
  gender:string;
  name: string;
  image: string;
  rooms: Array<Room>;
  role: string;
  playlists: Array<Playlist>;
  followers: Array<any>;
  following: Array<any>;
}

export interface Requests {
  user: {
    userId: string;
    userName: string;
  };
  status: string;
  room: Room;
}

export interface ClientToServerEvents {
  initializeBroadcast: () => void;
}
