import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const UserSocketContext = createContext(null);

export const UserSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const s = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId },
    });
    s.on("connect", () => {
      console.log("User socket connected!", s.id);
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <UserSocketContext.Provider value={socket}>
      {children}
    </UserSocketContext.Provider>
  );
};