import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  albums: Album[];
  songs: Song[];
  isLoading: boolean;
  fetchAlbums: () => Promise<void>;
  fetchSongs: () => Promise<void>;
}

const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,

  fetchAlbums: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data.albums });
    } catch (error: any) {
      console.log("Error in fetching albums", error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data.songs });
    } catch (error: any) {
      console.log("Error in fetching songs", error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
export default useMusicStore;
