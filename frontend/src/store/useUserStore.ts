import { axiosInstance } from "@/lib/axios";
import { Playlist, Room, User } from "@/types";

import toast from "react-hot-toast";
import { create } from "zustand";

interface UserStore {
  fetchJoinedRooms: () => Promise<void>;
  fetchPublicRooms: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  getCurrentUser:()=>Promise<void>;
  addToFavorite:(artist:string,imageUrl:string,songId:string,playlistName:string)=>Promise<void>;
  getPlaylistSongs:(id:string) =>Promise<void>;
  addSongToPlaylist:(playlistId:string|any,songId:string,playListName:string,artist:string,imageUrl:string) =>Promise<void>;
  addAlbumToPlaylist:(playListName:string,artist:string,albumId:string |any,imageUrl:string,songs:Array<string>) =>Promise<void>;
  rooms: Room[];
  publicRooms:Room[],
  currentUser:User | null;
  playlists: Playlist[];
  currentPlaylist:Playlist |null;
  isLoading: boolean;
  playlistLoading:boolean
}

const useUserStore = create<UserStore>((set, get) => ({
  isLoading: true,
  playlistLoading:true,
  rooms: [],
  publicRooms:[],
  playlists: [],
  currentPlaylist:null,
  currentUser:null,
  fetchJoinedRooms: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/user/getJoinedRooms");
      set({ rooms: response.data.rooms });
    } catch (error: any) {
      console.log(error.response.data.messages);
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPublicRooms:async()=>{
    set({isLoading:true})
    try {
      const response = await axiosInstance.get("/user/getPublicRooms");
      set({publicRooms:response.data.rooms})
    } catch (error:any) {
      console.log(error.response.data.message);

    }finally{
      set({isLoading:false})
    }
  },
  fetchPlaylists: async () => {
    set({ playlistLoading: true });

    try {
      const response = await axiosInstance.get("/user/getPlaylists");
      set({ playlists: response.data.playlists });
    } catch (error: any) {
      console.log(error.response.data.messages);
    } finally {
      set({ playlistLoading: false });
    }
  },
  getCurrentUser:async ()=>{
    set({isLoading:true});
    try {
      const response = await axiosInstance.get("/user/getCurrentUser");
      set({currentUser:response.data.user});
    } catch (error:any) {
      console.log(error.response.data.message)
    }finally{
      set({isLoading:false})
    }
  },
  addToFavorite:async(artist:string,imageUrl:string,songId:string,playListName:string)=>{
    if(!get().currentUser) return;
    try {
      const response = await axiosInstance.post("/user/addToFavorite",{
        artist,imageUrl,songId,playListName
      });

      if(response.data.status){
        set((state)=>({
          playlists:state.playlists.map((playlist)=>
          playlist.playListName ===playListName ? 
          {...playlist,
            songs:[...playlist.songs,songId]
          }:playlist
          ),
        }))
        toast.success(response.data.message);
      }
    

    } catch (error:any) {
      console.log(error.response.data.message)
      toast.error(error.response.data.message);
    }
  },
  getPlaylistSongs:async(id) =>{
    set({isLoading:true})
    try {
      const response = await axiosInstance.get(`/user/getPlaylistSongs/${id}`);
     
      if(response.data.status){
        set({currentPlaylist:response.data.songs[0].playlists});
      }
    } catch (error:any) {
      console.log(error.response.data.message);
    }finally{
      set({isLoading:false})
    }
  },
  addSongToPlaylist:async(playlistId, songId, playListName, artist, imageUrl) => {
      try {
        
        const response = await axiosInstance.post("/user/addToPlaylist",{playlistId,songId,playListName,artist,imageUrl})
        
        if(response.data.status){
          if(playlistId){
            set((state)=>({
            playlists:state.playlists.map((playlist)=>
              playlist._id === playlistId ?
              {...playlist,songs:[...playlist.songs,songId]}:
              playlist
            ),
          }))
          }else{
            set((state)=>({
              playlists:[...state.playlists,{_id:response.data.playlist.playlists[response.data.playlist.playlists.length-1]._id,playListName,artist,albumId:null,imageUrl,songs:[songId]}]
            }))
          }
          toast.success(response.data.message);
        }
      } catch (error:any) {
        console.log(error.response.data.message)
        toast.error(error.response.data.message)
      }
  },
  addAlbumToPlaylist:async( playListName, artist,albumId, imageUrl, songs)=> {
      try {
        const response = await axiosInstance.post("/user/addAlbumToPlaylist",{
          playListName,artist,albumId,imageUrl,songs
        });
        
        if(response.data.status){
          set((state)=>({
            playlists:[...state.playlists,{_id:response.data.playlist.playlists[response.data.playlist.playlists.length-1]._id,playListName,artist,albumId,imageUrl,songs}]
          }))
          toast.success(response.data.message);
        }
      } catch (error:any) {
        console.log(error.response.data.message)
      }
  },

}));

export default useUserStore;
