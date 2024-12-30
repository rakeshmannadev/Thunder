import { Song } from "@/types";
import { create } from "zustand";
import useSocketStore from "./useSocketStore";

interface PlayerStore {
  currentSong: Song |null;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
    if (
      useSocketStore.getState().socket &&
      useSocketStore.getState().isBroadcasting
    ) {
      useSocketStore
        .getState()
        .playSong(
          useSocketStore.getState().userId,
          useSocketStore.getState().roomId,
          song._id,
          null
        );
    }
  },
  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const songIndex = get().queue.findIndex((s) => s._id === song._id);

    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    set({
      isPlaying: willStartPlaying,
    });
  },
  playNext: () => {
    const { currentIndex, queue, isShuffle, isRepeat } = get();
    let nextIndex;

    if (isRepeat) {
      // If repeat is active, stay on the current song
      nextIndex = currentIndex % queue.length;
    } else if (isShuffle) {
      // Shuffle mode: Pick a random song that isn't the current one
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === currentIndex && queue.length > 1);
    } else {
      // Sequential mode
      nextIndex = currentIndex + 1;
    }

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });

      if (
        useSocketStore.getState().socket &&
        useSocketStore.getState().isBroadcasting
      ) {
        useSocketStore
          .getState()
          .playSong(
            useSocketStore.getState().userId,
            useSocketStore.getState().roomId,
            nextSong._id,
            null
          );
      }
    } else {
      // if no next song

      set({ isPlaying: false });
    }
  },
  playPrevious: () => {
    const { currentIndex, queue, isRepeat, isShuffle } = get();
    if (!queue || queue.length === 0) {
      set({ isPlaying: false });
      return;
    }

    let previousIndex;

    if (isRepeat) {
      previousIndex = currentIndex; // Stay on the current song
    } else if (isShuffle) {
      do {
        previousIndex = Math.floor(Math.random() * queue.length);
      } while (previousIndex === currentIndex && queue.length > 1);
    } else {
      previousIndex = currentIndex - 1;
    }

    if (previousIndex >= 0) {
      const prevSong = queue[previousIndex];

      set({
        currentSong: prevSong,
        currentIndex: previousIndex,
        isPlaying: true,
      });
      if (
        useSocketStore.getState().socket &&
        useSocketStore.getState().isBroadcasting
      ) {
        useSocketStore
          .getState()
          .playSong(
            useSocketStore.getState().userId,
            useSocketStore.getState().roomId,
            prevSong._id,
            null
          );
      }
    } else {
      // if no prev song

      set({ isPlaying: false });
    }
  },
}));

export default usePlayerStore;
