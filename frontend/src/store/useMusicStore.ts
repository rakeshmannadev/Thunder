import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  featured: Song[];
  madeForYouAlbums: Album[];
  trending:Song[];
  isLoading: boolean;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouAlbums: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
}

const useMusicStore = create<MusicStore>((set) => ({
  featured:[],
  madeForYouAlbums:[],
  trending:[],
  isLoading: false,

  fetchFeaturedSongs: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featured: response.data.songs });
    } catch (error: any) {
      console.log("Error in fetching albums", error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouAlbums: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/albums");
      set({ madeForYouAlbums: response.data.albums });
    } catch (error: any) {
      console.log("Error in fetching songs", error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchTrendingSongs:async ()=>{
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trending: response.data.songs });
    } catch (error: any) {
      console.log("Error in fetching songs", error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  }
}));
export default useMusicStore;
