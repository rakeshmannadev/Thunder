export interface Song {
  _id: string;
  songId: string;
  title: string;
  artists: {
    primary: [
      {
        id: string;
        name: string;
      }
    ];
    all: [];
  };
  artistId: string;
  album: string;
  albumId: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  releaseDate:string;
  releaseYear:string;
  playCount:number,
  label:string,
  language:string
}

export interface SearchedSong {
  albums: {
    results: [
      {
        id: string;
        title: string;
        image: [{ quality: string; url: string }];
        artist: string;
      }
    ];
  };
  artists: {
    results: [
      {
        id: string;
        title: string;
        image: [{ quality: string; url: string }];
        type: string;
        description: string;
      }
    ];
  };
  playlists: {
    results: [
      {
        id: string;
        title: string;
        type: string;
        image: [{ quality: string; url: string }];
      }
    ];
  };
  songs: {
    results: [
      {
        id: string;
        title: string;
        singers: string;
        image: [{ quality: string; url: string }];
      }
    ];
  };
  topQuery: {
    results: [
      {
        id: string;
        title: string;
        image: [{ quality: string; url: string }];
        type: string;
      }
    ];
  };
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
  artists: {
    primary: [
      {
        id: string;
        name: string;
      }
    ];
    all: any[];
    featured:any[];
  };
  releaseYear: string;
  songs: Song[];
}
export interface Artist {
  _id: string;
  name: string;
  artistId: string; 
  role: string; 
  followers: number;
  fanCount: number;
  isVerified: boolean;
  type: string;
  bio: [];
  dob: string;
  fb: string;
  twitter: string;
  instagram: string;
  wiki: string;
  image: string;
  topSongs: Song[];
  albums: Album[];
  singles: Album[];
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

  playlistId: string | null;
  playlistName: string;
  year: string | null;
  description: string | null;
  imageUrl: string;
  artist: {
    id:string;
    artistId: string;
    name: string;
    role: string;
    image: string;
    type: string;
  }[];
  albumId: string | any;
  songs: Song[] | any;
}
export interface User {
  _id: string;
  email: string;
  gender: string;
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
