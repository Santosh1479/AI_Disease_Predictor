import React, { createContext, useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const UserSocketContext = createContext(null);

export const UserSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  // Update userId when it changes in localStorage (login/logout)
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, [localStorage.getItem("userId")]);

  useEffect(() => {
    // Disconnect previous socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    // Connect if userId exists
    if (userId) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId },
      });
    }
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);

  return (
    <UserSocketContext.Provider value={socketRef.current}>
      {children}
    </UserSocketContext.Provider>
  );
};