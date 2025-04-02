import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { MessageContext } from "../context/MessageContext";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const ChatPage = () => {
  const { roomId } = useParams(); // Get the room ID from the URL
  const { senderId, receiverId, fetchRoomDetails } = useContext(MessageContext); // Use MessageContext
  const { user } = useContext(UserDataContext); // Get the current user's details from context
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch room details on component mount
  useEffect(() => {
    fetchRoomDetails(roomId);
  }, [roomId, fetchRoomDetails]);

  // Fetch messages for the chat room
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/messages/${roomId}`
        );
        setMessages(response.data); // Load old messages
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for new messages from the socket
    socket.on("receive_message", (data) => {
      if (data.roomId === roomId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      roomId,
      senderId: user.id, // Use the current user's ID
      receiverId, // Use the receiverId from MessageContext
      message: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    console.log("Message Data:", messageData); // Debug the message data

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/messages`, messageData);
      socket.emit("send_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center bg-blue-500 text-white p-4 shadow-md">
        <h1 className="text-lg font-bold">Chat Room</h1>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.senderId === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.senderId === user.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p>{msg.message}</p>
              <small className="block text-xs mt-1">{msg.time}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center p-4 bg-white border-t border-gray-300">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-lg p-2 mr-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;