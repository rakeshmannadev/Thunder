import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import usePlayerStore from "./usePlayerStore";
import useRoomStore from "./useRoomStore";
import useUserStore from "./useUserStore";
import { SongRequest, User } from "@/types";
import useShowCustomToast from "@/hooks/useShowCustomToast";

interface SocketState {
  socket: Socket | null;
  isLoading: boolean;
  isJoined: boolean;
  isBroadcasting: boolean;
  isPlayingSong: boolean;
  activeUsers: string[];
  songRequests: SongRequest[];
  requestedUser: User | null;
  userName: string;
  userId: string;
  roomId: string;
  connectSocket: (userId: string) => void;
  startBroadcast: (userId: string, roomId: string) => void;
  playSong: (
    userId: string,
    roomId: string,
    songId: string,
    requestedUserId: string | null
  ) => void;
  pauseSong: (userId: string, roomId: string, songId: string) => void;
  endBroadcast: (userId: string, roomId: string) => void;
  updateTime: (roomId: string, songId: string, currentTime: number) => void;
  joinRoom: (roomId: string, userId: string) => void;
  leaveRoom: (roomId: string, userId: string) => void;
  sendJoinRequest: (userId: string, roomId: string) => void;
  sendSongRequest: (userId: string, roomId: string, song: SongRequest) => void;
  acceptJoinRequest: (userId: string, roomId: string) => void;
  rejectJoinRequest: (userId: string, roomId: string) => void;
  kickMember: (userId: string, roomId: string, memberId: string) => void;
  deleteRoom: (userId: string, roomId: string, room_id: string) => void;
  sendMessage: (content: string, senderId: string, roomId: string) => void;
  adminDeleteMessage: (
    roomId: string,
    messageId: string,
    adminId: string
  ) => void;
  deleteForEveryone: (
    roomId: string,
    messageId: string,
    senderId: string
  ) => void;
  editMessage: (
    roomId: string,
    messageId: string,
    senderId: string,
    content: string
  ) => void;
  disconnectSocket: () => void;
}

const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isLoading: false,
  isJoined: false,
  isBroadcasting: false,
  isPlayingSong: false,
  activeUsers: [],
  songRequests: [],
  userName: "",
  requestedUser: null,
  userId: "",
  roomId: "",
  connectSocket: (userId) => {
    const socket = io(baseURL, {
      query: {
        userId,
      },
    });
    set({ socket });

    // Listen to socket events inside the store
    socket.on("connect", () => {});
    socket.on("joinRequest", (data) => {
      const { showToast } = useShowCustomToast();
      useRoomStore.setState({
        joinRequests: [...useRoomStore.getState().joinRequests, data.request],
      });

      showToast(
        "New join request for " + data.request.room.roomName,
        data.request.user.userImage,
        data.request.user.userName
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
      const { showToast } = useShowCustomToast();
      if (data.userId !== useUserStore.getState().currentUser?._id) {
        useUserStore.setState((state) => ({
          publicRooms: state.publicRooms.map((room) =>
            room._id === data.room._id
              ? {
                  ...room,
                  requests: room.requests.filter(
                    (request) => request.user.userId !== data.memberId
                  ),
                }
              : room
          ),
        }));
        showToast(data.message, data.room.image, data.room.roomName);
      }
      useRoomStore.setState((state) => ({
        joinRequests: state.joinRequests.filter(
          (request) =>
            request.room._id !== data.room._id &&
            request.user.userId !== data.room.requests.user.userId
        ),
      }));
      toast.success("Requst rejected");
    });

    socket.on("joinRequestAccepted", (data) => {
      const { showToast } = useShowCustomToast();
      if (data.userId !== useUserStore.getState().currentUser?._id) {
        useUserStore.setState({
          rooms: [...useUserStore.getState().rooms, data.room],
        });
        useUserStore.setState((state) => ({
          publicRooms: state.publicRooms.filter(
            (room) => room._id !== data.room._id
          ),
        }));
        showToast(
          `Join request accepted by ${data.room.roomName} admin `,
          data.room.image,
          data.room.roomName
        );
      } else {
        useRoomStore.setState((state) => ({
          joinRequests: state.joinRequests.filter((request) => {
            request.room._id !== data.room._id &&
              request.user.userId !== data.room.requests.user.userId;
          }),
        }));
        toast.success("Requst accepted");
      }
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
      console.log("audio", audio);
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
      const { songId, userName, requestedUser, userId } = data;
      set({ isLoading: true });
      try {
        const response = await axiosInstance.get(`/songs/${songId}`);
        if (response.data.status) {
          const song = response.data.song;
          usePlayerStore.getState().setCurrentSong(song);
          set({
            isPlayingSong: true,
            isBroadcasting: true,
            userName,
            userId,
            requestedUser,
          });
        }
      } catch (error: any) {
        console.log(error.response.data.message);
      } finally {
        set({ isLoading: false });
      }
    });
    socket.on("newSongRequest", (data) => {
      const { showToast } = useShowCustomToast();

      set((state) => ({
        songRequests: [...state.songRequests, data.song],
      }));
      showToast(
        "New song requst received ",
        data.user.image,
        data.song.userName
      );
    });

    socket.on("songPaused", (data) => {
      const { songId } = data;
      const { isPlayingSong } = get();
      if (
        usePlayerStore.getState().currentSong!._id === songId &&
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
      const { showToast } = useShowCustomToast();

      useUserStore.setState((state) => ({
        rooms: state.rooms.filter((room) => room._id !== data.roomId),
      }));
      useRoomStore.getState().currentRoom?._id === data.roomId &&
        useRoomStore.setState({ currentRoom: null });
      showToast(
        `${data.room.roomName} is deleted by admin`,
        data.room.image,
        data.room.roomName
      );
    });
    socket.on("kickedFromRoom", (data) => {
      const { showToast } = useShowCustomToast();
      useUserStore.setState({
        rooms: useUserStore
          .getState()
          .rooms.filter((room) => room._id !== data.roomId),
      });
      useRoomStore.getState().currentRoom?._id === data.roomId &&
        useRoomStore.setState({ currentRoom: null });

      showToast(data.message, data.image, data.roomName);
    });
    socket.on("userKicked", (data) => {
      useRoomStore.setState({
        members: useRoomStore
          .getState()
          .members.filter((member) => member._id !== data.memberId),
      });
      toast.success(data.message);
    });
    socket.on("newMessage", (data) => {
      useRoomStore.setState((state) => ({
        currentRoom: {
          ...state.currentRoom!,
          messages: [...state.currentRoom!.messages, data.message],
        },
      }));
    });
    socket.on("adminDeletedMessage", (data) => {
      useRoomStore.setState((state) => ({
        currentRoom: {
          ...state.currentRoom!,
          messages: state.currentRoom!.messages.map((message) =>
            message._id === data.messageId
              ? { ...message, message: "" }
              : message
          ),
        },
      }));
    }),
      socket.on("deletedForEveryone", (data) => {
        useRoomStore.setState((state) => ({
          currentRoom: {
            ...state.currentRoom!,
            messages: state.currentRoom!.messages.map((message) =>
              message._id === data.messageId
                ? { ...message, message: "" }
                : message
            ),
          },
        }));
      }),
      socket.on("messageEdited", (data) => {
        useRoomStore.setState((state) => ({
          currentRoom: {
            ...state.currentRoom!,
            messages: state.currentRoom!.messages.map((message) =>
              message._id === data.messageId
                ? { ...message, message: data.content }
                : message
            ),
          },
        }));
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
  playSong: (userId, roomId, songId, requestedUserId = null) => {
    const { socket } = get();

    if (socket) {
      socket.emit("playSong", { userId, roomId, songId, requestedUserId });
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
  kickMember: (userId, roomId, memberId) => {
    const { socket } = get();
    if (socket) {
      console.log("Called");
      socket.emit("kickMember", { userId, roomId, memberId });
    }
  },
  leaveRoom: (roomId: string, userId: string) => {
    const audio = document.querySelector("audio");
    const { socket } = get();
    if (socket) {
      socket.emit("leaveRoom", { userId, roomId });
    }
    set({ isPlayingSong: false, isBroadcasting: false, isJoined: false });
    if (get().isPlayingSong) {
      usePlayerStore.setState({ currentSong: null, isPlaying: false });
      if (audio) {
        audio.load();
      }
    }
  },
  sendSongRequest: (userId, roomId, song) => {
    const { socket } = get();
    if (socket) {
      socket.emit("sendSongRequest", { userId, roomId, song });
    }
    toast.success("Song request send to admin");
  },
  endBroadcast: (userId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("endBroadcast", { userId, roomId });
    }
  },
  deleteRoom: (userId, roomId, room_id) => {
    const { socket } = get();
    set({ isLoading: true });
    if (socket) {
      socket.emit("deleteRoom", { userId, roomId, room_id });
    }
    set({ isLoading: false });
  },
  sendMessage: (content, senderId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("sendMessage", { content, senderId, roomId });
    }
  },
  adminDeleteMessage: (roomId, messageId, adminId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("adminDeleteMessage", { roomId, messageId, adminId });
    }
  },
  deleteForEveryone: (roomId, messageId, senderId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("deleteForEveryone", { roomId, messageId, senderId });
    }
  },
  editMessage: (roomId, messageId, senderId, content) => {
    const { socket } = get();
    if (socket) {
      socket.emit("editMessage", { roomId, messageId, senderId, content });
    }
  },
}));

export default useSocketStore;
