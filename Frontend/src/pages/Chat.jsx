import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000', {
  withCredentials: true,
});

const Chat = () => {
  const location = useLocation();
  const { roomId, userId, doctorId } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (roomId) {
      socket.emit("join_room", roomId);

      socket.on("receive_message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [roomId]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const messageData = {
        room: roomId,
        author: userId,
        message: newMessage,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>
              <strong>{msg.author}</strong>: {msg.message} <em>{msg.time}</em>
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Type your message here..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;