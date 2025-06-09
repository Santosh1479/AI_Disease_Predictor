// DoctorSocketContext.jsx
import React, { createContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";
export const DoctorSocketContext = createContext(null);

export const DoctorSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);
  return (
    <DoctorSocketContext.Provider value={socketRef.current}>
      {children}
    </DoctorSocketContext.Provider>
  );
};