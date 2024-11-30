import { axiosInstance } from "@/lib/axios";
import { Album, SearchedSong, Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  featured: Song[];
  madeForYouAlbums: Album[];
  currentAlbum: Album | null;
  trending: Song[];
  searchedSongs: SearchedSong[];
  isLoading: boolean;
  searchLoading: boolean;
  fetchAllSongs: () => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouAlbums: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  searchSong: (query: string) => Promise<void>;
}

const useMusicStore = create<MusicStore>((set) => ({
  songs: [],
  featured: [],
  madeForYouAlbums: [],
  trending: [],
  currentAlbum: null,
  searchedSongs: [],
  isLoading: false,
  searchLoading: false,

  fetchAllSongs: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data.songs });
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
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
  fetchTrendingSongs: async () => {
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trending: response.data.songs });
    } catch (error: any) {
      console.log("Error in fetching songs", error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbumById: async (albumId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/albums/${albumId}`);
      if (response.status) {
        set({ currentAlbum: response.data.album });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  searchSong: async (query) => {
    set({ searchLoading: true });
    try {
      const response = await axiosInstance.get(`/songs/searchSong/${query}`);
      if (response.data.status) {
        set({ searchedSongs: response.data.song });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ searchLoading: false });
    }
  },
}));
export default useMusicStore;
