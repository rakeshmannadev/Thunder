import { axiosInstance } from "@/lib/axios";
import { Album, Artist, SearchedSong, Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  featured: Song[];
  madeForYouAlbums: Album[];
  currentAlbum: Album | null;
  currentArtist: Artist | null;
  trending: Song[];
  searchedSongs: SearchedSong | null;
  single: Song | null;
  isLoading: boolean;
  searchLoading: boolean;
  fetchAllSongs: () => Promise<void>;
  fetchArtistById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouAlbums: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  searchSong: (query: string) => Promise<void>;
  fetchSingle: (id: string) => Promise<void>;
}

const useMusicStore = create<MusicStore>((set) => ({
  songs: [],
  single: null,
  featured: [],
  madeForYouAlbums: [],
  trending: [],
  currentAlbum: null,
  currentArtist: null,
  searchedSongs: null,
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
  fetchArtistById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/artists/${id}`);
      set({ currentArtist: response.data.artist });
    } catch (error: any) {
      console.log(error.response.data.message);
      set({ currentArtist: null });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSingle: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/songs/${id}`);
      if (response.data) {
        const albumResponse = await axiosInstance.get(
          `/albums/${response.data.song.albumId}`
        );
        if (albumResponse.status) {
          set({ currentAlbum: albumResponse.data.album });
        }
        const artistResponse = await axiosInstance.get(
          `/artists/${response.data.song.artistId}`
        );
        if (artistResponse) {
          set({ currentArtist: artistResponse.data.artist });
        }
        set({ single: response.data.song });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      set({ single: null });
      set({ currentAlbum: null });
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
