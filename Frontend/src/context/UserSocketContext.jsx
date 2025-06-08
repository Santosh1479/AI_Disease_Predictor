import React, { createContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

export const UserSocketContext = createContext(null);

export const UserSocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && !socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId },
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <UserSocketContext.Provider value={socketRef.current}>
      {children}
    </UserSocketContext.Provider>
  );
};