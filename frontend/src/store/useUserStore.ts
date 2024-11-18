import { axiosInstance } from "@/lib/axios";
import { Playlist, Room, User } from "@/types";
import { create } from "zustand";

interface UserStore {
  fetchJoinedRooms: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  getCurrentUser:()=>Promise<void>;
  rooms: Room[];
  currentUser:User | null;
  playlists: Playlist[];
  isLoading: boolean;
}

const useUserStore = create<UserStore>((set, get) => ({
  isLoading: true,
  rooms: [],
  playlists: [],
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
  fetchPlaylists: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/user/getPlaylists");
      set({ playlists: response.data.playlists });
    } catch (error: any) {
      console.log(error.response.data.messages);
    } finally {
      set({ isLoading: false });
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
  }
}));

export default useUserStore;
