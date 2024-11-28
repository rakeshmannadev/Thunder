import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import usePlayerStore from "./usePlayerStore";
import useRoomStore from "./useRoomStore";
import useUserStore from "./useUserStore";

interface SocketState {
  socket: Socket | null;
  isLoading: boolean;
  isJoined: boolean;
  isBroadcasting: boolean;
  isPlayingSong: boolean;
  activeUsers: string[];
  userName: string;
  userId: string;
  roomId: string;
  connectSocket: (userId: string) => void;
  startBroadcast: (userId: string, roomId: string) => void;
  playSong: (userId: string, roomId: string, songId: string) => void;
  pauseSong: (userId: string, roomId: string, songId: string) => void;
  endBroadcast: (userId: string, roomId: string) => void;
  updateTime: (roomId: string, songId: string, currentTime: number) => void;
  joinRoom: (roomId: string, userId: string) => void;
  leaveRoom: (roomId: string, userId: string) => void;
  sendJoinRequest: (userId: string, roomId: string) => void;
  acceptJoinRequest: (userId: string, roomId: string) => void;
  rejectJoinRequest: (userId: string, roomId: string) => void;
  deleteRoom: (userId: string, roomId: string, room_id: string) => void;
  disconnectSocket: () => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isLoading: false,
  isJoined: false,
  isBroadcasting: false,
  isPlayingSong: false,
  activeUsers: [],
  userName: "",
  userId: "",
  roomId: "",
  connectSocket: (userId) => {
    const socket = io("http://localhost:3000", {
      query: {
        userId,
      },
    });
    set({ socket });

    // Listen to socket events inside the store
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("joinRequest", (data) => {
      useRoomStore.setState({
        joinRequests: [...useRoomStore.getState().joinRequests, data.request],
      });
      toast.success(
        "New join request received for " + data.request.room.roomName
      );
    });

    socket.on("joinRequestStatus", (data) => {
      if (data.status) {
        toast.success(data.message);
        useUserStore.setState((state) => ({
          publicRooms: state.publicRooms.map((room) =>
            room._id === data.room._id
              ? { ...room, requests: [...room.requests, ...data.room.requests] }
              : room
          ),
        }));
      } else {
        toast.error(data.message);
      }
    });

    socket.on("joinRequestRejected", (data) => {
      useRoomStore.setState((state) => ({
        joinRequests: state.joinRequests.filter(
          (request) =>
            request.room._id !== data.room._id &&
            request.user.userId !== data.room.requests.user.userId
        ),
      }));
      toast.error(data.message);
    });
    socket.on("joinRequestAccepted", (data) => {
      useUserStore.setState({
        rooms: [...useUserStore.getState().rooms, data.room],
      });
      useUserStore.setState((state) => ({
        publicRooms: state.publicRooms.filter(
          (room) => room._id !== data.room._id
        ),
      }));
      useRoomStore.setState((state) => ({
        joinRequests: state.joinRequests.filter((request) => {
          request.room._id !== data.room._id &&
            request.user.userId !== data.room.requests.user.userId;
        }),
      }));
      toast.success("Join request accepted for " + data.room.roomName);
    });
    socket.on("adminJoins", (data) => {
      toast.success(data.message);
      set({ roomId: data.roomId, isJoined: true });
    });
    socket.on("userJoins", (data) => {
      toast.success(data.message);
      set({ roomId: data.roomId, isJoined: true });
    });
    socket.on("updateUsers", (data) => {
      set({ activeUsers: data.users }); // Update Zustand state
    });
    socket.on("timeUpdated", (data) => {
      const audio = document.querySelector("audio");
      if (audio) {
        audio.currentTime = parseInt(data.currentTime);
      }
      console.log("Time updated");
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
      set({ isLoading: true });
      try {
        const response = await axiosInstance.get(`/songs/${songId}`);
        if (response.data.status) {
          const song = response.data.song;
          usePlayerStore.getState().setCurrentSong(song);
          set({ isPlayingSong: true, isBroadcasting: true });
        }
      } catch (error: any) {
        console.log(error.response.data.message);
      } finally {
        set({ isLoading: false });
      }
    });

    socket.on("songPaused", (data) => {
      const { songId } = data;
      const { isPlayingSong } = get();
      if (
        usePlayerStore.getState().currentSong._id === songId &&
        isPlayingSong
      ) {
        set({ isPlayingSong: false });
        usePlayerStore.getState().togglePlay();
      }
    });

    socket.on("broadcastEnded", (data) => {
      const audio = document.querySelector("audio");
      toast.success(data.message);
      set({ isBroadcasting: false, isPlayingSong: false });
      usePlayerStore.setState({ currentSong: null, isPlaying: false });
      if (audio) {
        audio.load();
      }
    });
    socket.on("roomDeleted", (data) => {
      console.log("room deleted");
      useUserStore.setState((state) => ({
        rooms: state.rooms.filter((room) => room._id !== data.roomId),
      }));
      useRoomStore.getState().currentRoom?._id === data.roomId &&
        useRoomStore.setState({ currentRoom: null });
      toast.success("Sorry this room is deleted by admin");
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    const audio = document.querySelector("audio");
    if (socket) {
      socket.disconnect();
      set({
        isJoined: false,
        socket: null,
        isBroadcasting: false,
        isPlayingSong: false,
      });
      usePlayerStore.setState({ currentSong: null, isPlaying: false });
      if (audio) {
        audio.load();
      }
      console.log("Socket disconnected.");
    }
  },
  startBroadcast: (userId: string, roomId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit("initializeBroadcast", { userId, roomId });
    }
  },
  sendJoinRequest: async (userId, roomId) => {
    const { socket } = get();

    if (socket) {
      socket.emit("sendJoinRequest", { userId, roomId });
    }
  },
  updateTime: (roomId, songId, currentTime) => {
    const { socket } = get();
    if (socket) {
      socket.emit("updateTime", { roomId, songId, currentTime });
    }
  },
  playSong: (userId, roomId, songId) => {
    const { socket } = get();

    if (socket) {
      socket.emit("playSong", { userId, roomId, songId });
    }
  },
  pauseSong: (userId, roomId, songId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("pauseSong", { userId, roomId, songId });
    }
  },
  joinRoom: (userId: string, roomId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit("joinRoom", { userId, roomId });
    }
  },
  acceptJoinRequest: (userId, roomId) => {
    const { socket } = get();

    if (socket) {
      socket.emit("acceptJoinRequest", { userId, roomId });
    }
  },
  rejectJoinRequest: (userId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("rejectJoinRequest", { userId, roomId });
    }
  },
  leaveRoom: (roomId: string, userId: string) => {
    const audio = document.querySelector("audio");
    const { socket } = get();
    if (socket) {
      socket.emit("leaveRoom", { userId, roomId });
    }
    set({ isPlayingSong: false, isBroadcasting: false, isJoined: false });
    usePlayerStore.setState({ currentSong: null, isPlaying: false });
    if (audio) {
      audio.load();
    }
  },
  endBroadcast: (userId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("endBroadcast", { userId, roomId });
    }
  },
  deleteRoom: async (userId, roomId, room_id) => {
    const { socket } = get();
    set({ isLoading: true });
    if (socket) {
      socket.emit("deleteRoom", { userId, roomId, room_id });
    }
    set({ isLoading: false });
  },
}));

export default useSocketStore;
