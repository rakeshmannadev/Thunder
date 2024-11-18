import { axiosInstance } from "@/lib/axios";
import { Playlist, Room } from "@/types";
import { create } from "zustand";

interface UserStore {
  fetchJoinedRooms: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  rooms: Room[];
  playlists: Playlist[];
  isLoading: boolean;
}

const useUserStore = create<UserStore>((set, get) => ({
  isLoading: true,
  rooms: [],
  playlists: [],
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
}));

export default useUserStore;
