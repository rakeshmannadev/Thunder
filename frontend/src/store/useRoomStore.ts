import { axiosInstance } from "@/lib/axios";
import { Room, User } from "@/types";
import { create } from "zustand";

interface RoomStore {
  activeMembers: User[];
  members: User[];
  currentRoom: Room | null;
  isLoading: boolean;
  fetchActiveMembers: (users: string[]) => Promise<void>;
  fetchRoomMembers: (roomId: string) => Promise<void>;
  getRoomById: (roomId: string) => Promise<void>;
}

const useRoomStore = create<RoomStore>((set) => ({
  activeMembers: [],
  members: [],
  currentRoom: null,
  isLoading: false,
  fetchActiveMembers: async (users) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/rooms/getActiveUsers", {
        users,
      });
      set({ activeMembers: response.data.users });
    } catch (error: any) {
      console.log(error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchRoomMembers: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/rooms/getRoomMembers/${roomId}`
      );
      set({ members: response.data.participants });
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  getRoomById: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/rooms/getRoomById/${roomId}`);
      if (response.data.status) {
        set({ currentRoom: response.data.room });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useRoomStore;
