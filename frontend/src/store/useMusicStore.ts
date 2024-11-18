import { axiosInstance } from "@/lib/axios";
import { Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  featured: Song[];
  madeForYou: Song[];
  trending:Song[];
  isLoading: boolean;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
}

const useMusicStore = create<MusicStore>((set) => ({
  featured:[],
  madeForYou:[],
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

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYou: response.data.songs });
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
