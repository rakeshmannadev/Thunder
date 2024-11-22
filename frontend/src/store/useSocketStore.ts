import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  isBroadcasting: boolean;
  activeUsers: string[];
  userName: string;
  roomId: string;
  connectSocket: (userId: string, roomId: string) => void;
  startBroadcast: () => void;
  endBroadcast: () => void;
  updateUsers: (users: string[]) => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isBroadcasting: false,
  activeUsers: [],
  userName: "",
  roomId: "",

  connectSocket: (userId: string, roomId: string) => {
    const socket = io("http://localhost:3000", {
      query: { userId, roomId },
    });
    set({ socket, roomId });

    // Listen to socket events inside the store
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("broadcastStarted", (data) => {
      console.log(`${data.userName} has started the broadcast.`);
      set({ isBroadcasting: true, userName: data.userName });
    });

    socket.on("broadcastEnded", (data) => {
      console.log(data.message);
      set({ isBroadcasting: false });
    });

    socket.on("updateUsers", (data) => {
      console.log("Active users:", data.users);
      set({ activeUsers: data.users });
    });

    socket.on("broadcastResumed", (data) => {
      console.log(`${data.userName} has resumed the broadcast.`);
    });
  },

  startBroadcast: () => {
    const { socket, roomId, userName } = get();
    if (socket) {
      socket.emit("initializeBroadcast", { userId: userName, roomId });
    }
  },

  endBroadcast: () => {
    const { socket, roomId } = get();
    if (socket) {
      socket.emit("endBroadcast", { roomId });
    }
  },

  updateUsers: (users: string[]) => {
    set({ activeUsers: users });
  },
}));

export default useSocketStore;
