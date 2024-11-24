import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import usePlayerStore from "./usePlayerStore";

interface SocketState {
  socket: Socket | null;
  isLoading:boolean;
  isJoined: boolean;
  isBroadcasting: boolean;
  isPlayingSong: boolean;
  activeUsers: string[];
  userName: string;
  userId: string;
  roomId: string;
  connectSocket: (roomId: string, userId: string) => void;
  startBroadcast: (userId: string, roomId: string) => void;
  playSong: (userId: string, roomId: string, songId: string) => Promise<void>;
  endBroadcast: (userId: string, roomId: string) => void;
  joinRoom: (roomId: string, userId: string) => void;
  leaveRoom: (roomId: string, userId: string) => void;
  disconnectSocket: () => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isLoading:false,
  isJoined: false,
  isBroadcasting: false,
  isPlayingSong: false,
  activeUsers: [],
  userName: "",
  userId: "",
  roomId: "",
  connectSocket: (roomId, userId) => {
    const socket = io("http://localhost:3000", {
      query: {
        roomId,
        userId,
      },
    });
    set({ socket, roomId: roomId, isJoined: true });

    // Listen to socket events inside the store
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("adminJoins", (data) => {
      toast.success(data.message);
    });
    socket.on("updateUsers", (data) => {
      set({ activeUsers: data.users }); // Update Zustand state
    });

    socket.on("broadcastStarted", (data) => {
      toast.success(`${data.userName} has started the broadcast.`);
      set({
        isBroadcasting: true,
        userName: data.userName,
        userId: data.userId,
      });
    });

    socket.on("songStarted", async (data) => {
      const { songId } = data;
      set({isLoading:true})
      try {
        const response = await axiosInstance.get(`/songs/${songId}`);
        if (response.data.status) {
          const song = response.data.song;
          usePlayerStore.setState({ currentSong: song });
          set({ isPlayingSong: true });
        }
      } catch (error:any) {
        console.log(error.response.data.message);
      }finally{
        set({isLoading:false});
      }
    });

    socket.on("broadcastEnded", (data) => {
      toast.success(data.message);
      set({ isBroadcasting: false });
      // socket.close();
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ isJoined: false, socket: null });
      console.log("Socket disconnected.");
    }
  },
  startBroadcast: (userId: string, roomId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit("initializeBroadcast", { userId, roomId });
    }
  },
  playSong: async (userId, roomId, songId) => {
    const { socket } = get();

    if (socket) {
      socket.emit("playSong", { userId, roomId, songId });
    }
  },
  joinRoom: (userId: string, roomId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit("joinRoom", { userId, roomId });
    }
  },
  leaveRoom: (roomId: string, userId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit("leaveRoom", { userId, roomId });
    }
  },
  endBroadcast: (userId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("endBroadcast", { userId, roomId });
    }
  },
}));

export default useSocketStore;
