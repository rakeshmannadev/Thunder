import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  isBroadcasting: boolean;
  activeUsers: string[];
  userName: string;
  roomId: string;
  connectSocket: (roomId:string) => void;
  startBroadcast: (userId: string, roomId: string) => void;
  endBroadcast: () => void;
  joinRoom: (roomId: string, userId: string) => void;
  leaveRoom: (roomId: string, userId: string) => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isBroadcasting: false,
  activeUsers: [],
  userName: "",
  roomId: "",
  connectSocket: (roomId) => {
    const socket = io("http://localhost:3000", {
      query:{
        roomId
      }
    });
    set({ socket });

    // Listen to socket events inside the store
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("adminJoins",(data)=>{
      console.log(data.message);
    })
    socket.on("updateUsers", (data) => {
      set({ activeUsers: data.users }); // Update Zustand state
    });

    socket.on("broadcastStarted", (data) => {
      console.log(`${data.userName} has started the broadcast.`);
      set({ isBroadcasting: true, userName: data.userName });
    });

    socket.on("broadcastEnded", (data) => {
      console.log(data.message);
      set({ isBroadcasting: false });
      // socket.close();
    });


    socket.on("broadcastResumed", (data) => {
      console.log(`${data.userName} has resumed the broadcast.`);
    });
    socket.on('disconnect', (reason) => {
      set({socket:null})
      console.log('Disconnected from server:', reason);
    });
  },

  startBroadcast: (userId: string, roomId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit("initializeBroadcast", { userId, roomId });
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
    // socket?.close();
    set({ activeUsers: [] });
  },
  endBroadcast: () => {
    const { socket, roomId } = get();
    if (socket) {
      socket.emit("endBroadcast", { roomId });
    }
  },
}));

export default useSocketStore;
