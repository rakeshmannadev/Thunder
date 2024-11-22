import { useAuth } from "@clerk/clerk-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      const socket = io("http://localhost:3000", {
        // initialize socket connection
        query: {
          userId,
        },
      });
      setSocket(socket);

      //   Listen event and set online users
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        setSocket(null);
      }
    }
  }, [userId]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
