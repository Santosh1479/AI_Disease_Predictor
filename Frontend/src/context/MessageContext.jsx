import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  const fetchRoomDetails = async (roomId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/chat/room/${roomId}`
      );
      const { senderId, receiverId } = response.data;

      setSenderId(senderId);
      setReceiverId(receiverId);
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  return (
    <MessageContext.Provider value={{ senderId, receiverId, fetchRoomDetails }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;