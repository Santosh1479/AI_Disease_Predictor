import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  return (
    <MessageContext.Provider value={{ senderId, receiverId, setSenderId, setReceiverId }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;