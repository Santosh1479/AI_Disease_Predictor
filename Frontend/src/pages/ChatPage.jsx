import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";

const socket = io(`${import.meta.env.SOCKET}`, {
  withCredentials: true,
});

const ChatPage = () => {
  const { roomId } = useParams(); // Get the room ID from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/messages/doctor/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token
            },
          }
        );
        setMessages(response.data); // Load old messages
      } catch (error) {
        console.error(
          "Error fetching messages:",
          error.response?.data || error.message
        );
      }
    };

    fetchMessages();

    socket.on("receive_message", (data) => {
      if (data.room === roomId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      room: roomId,
      author: "Doctor",
      message: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData); // Emit the message to the server
    setMessages((prevMessages) => [...prevMessages, messageData]); // Update local messages
    setNewMessage(""); // Clear the input field
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto border-b border-gray-300">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 ${
              msg.author === "Doctor" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.author === "Doctor"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p>{msg.message}</p>
              <small className="block text-xs">{msg.time}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center p-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-lg p-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;