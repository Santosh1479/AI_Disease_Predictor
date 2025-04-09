import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { MessageContext } from "../context/MessageContext";
import { SocketContext } from "../context/SocketContext"; // Import SocketContext
import axios from "axios";

const ChatPage = () => {
  const { roomId } = useParams(); // Get the room ID from the URL
  const { senderId, setSenderId, receiverId, setReceiverId } = useContext(MessageContext);
  const { socket } = useContext(SocketContext); // Use the socket from SocketContext
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Get the current user's ID from localStorage
  const currentUserId = localStorage.getItem("userId");

  // Fetch room details on component mount
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

  useEffect(() => {
    fetchRoomDetails(roomId);
  }, [roomId]);

  // Fetch messages for the chat room
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/messages/${roomId}`
      );
      setMessages(response.data); // Load messages from the database
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
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
  }, [roomId, socket]);

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      roomId,
      senderId: currentUserId, // Use the current user's ID from localStorage
      receiverId: receiverId, // Use the receiverId from context
      message: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    try {
      // Emit the message to the socket server
      socket.emit("send_message", messageData);

      // Save the message to the backend
      await axios.post(`${import.meta.env.VITE_BASE_URL}/messages`, messageData);

      // Fetch the latest messages from the database
      fetchMessages();

      // Clear the input field
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
              msg.senderId._id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.senderId._id === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="mb-1">{msg.message}</p>
              <small className="block text-xs text-white">
                {new Date(msg.timestamp).toLocaleString()} {/* Format the timestamp */}
              </small>
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