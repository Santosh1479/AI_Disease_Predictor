import React, { createContext, useState } from "react";

export const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  return (
    <MessageContext.Provider
      value={{
        roomId,
        setRoomId,
        senderId,
        setSenderId,
        receiverId,
        setReceiverId,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;