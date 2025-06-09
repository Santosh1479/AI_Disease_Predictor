import React, { createContext, useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
export const DoctorSocketContext = createContext(null);

export const DoctorSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <DoctorSocketContext.Provider value={socket}>
      {children}
    </DoctorSocketContext.Provider>
  );
};