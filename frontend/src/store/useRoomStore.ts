import { axiosInstance } from "@/lib/axios";
import { Room, User } from "@/types";
import { create } from "zustand";
import useUserStore from "./useUserStore";
import toast from "react-hot-toast";

interface RoomStore {
  activeMembers: User[];
  members: User[];
  currentRoom: Room | null;
  isLoading: boolean;
  createRoom: (
    roomName: string,
    visability: string,
    imageFile: string
  ) => Promise<void>;
  fetchActiveMembers: (users: string[]) => Promise<void>;
  fetchRoomMembers: (roomId: string) => Promise<void>;
  getRoomById: (roomId: string) => Promise<void>;
  joinPublicRoom: (roomId: string) => Promise<void>;
  sendJoinRequest: (roomId: string) => Promise<void>;
}

const useRoomStore = create<RoomStore>((set) => ({
  activeMembers: [],
  members: [],
  currentRoom: null,
  isLoading: false,
  createRoom: async (roomName, visability, imageFile) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(
        "/rooms/create-room",
        {
          roomName,
          visability,
          imageFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status) {
        useUserStore.setState({
          rooms: [...useUserStore.getState().rooms, response.data.room],
        });
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
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
  joinPublicRoom: async (roomId) => {
    try {
      const response = await axiosInstance.put(
        `/user/join-public-room/${roomId}`
      );
      if (response.data.status) {
        useUserStore.setState({
          rooms: [...useUserStore.getState().rooms, response.data.room],
        });
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  },
  sendJoinRequest: async (roomId) => {
    try {
      const response = await axiosInstance.get(
        `/user/send-join-request/${roomId}`
      );

      toast.success(response.data.message);
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  },
}));

export default useRoomStore;
