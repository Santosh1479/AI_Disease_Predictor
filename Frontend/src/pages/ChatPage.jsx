import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import { UserDataContext } from "../context/UserContext"; // Import UserDataContext

const socket = io(import.meta.env.VITE_SOCKET_URL);

const ChatPage = () => {
  const { roomId } = useParams(); // Get the room ID from the URL
  const { doctorDetails, setDoctorDetails } = useContext(DoctorContext); // Get and set doctor details from context
  const { user, setUser } = useContext(UserDataContext); // Get and set user details from context
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch doctor and user details based on roomId
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat/room/${roomId}`
        );

        const { doctorId, doctorName, userId, userName } = response.data;

        // Update DoctorContext
        setDoctorDetails({
          doctorId,
          doctorName,
        });

        // Update UserContext
        setUser({
          id: userId,
          fullname: {
            firstname: userName.split(" ")[0],
            lastname: userName.split(" ")[1] || "",
          },
          email: "", // Add email if available in the response
        });
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, [roomId, setDoctorDetails, setUser]);

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
      senderId: user.id, // Use the actual user ID from context
      receiverId: doctorDetails.doctorId, // Doctor's ID from context
      message: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    try {
      // Save the message to the backend
      await axios.post(`${import.meta.env.VITE_BASE_URL}/messages`, messageData);

      // Emit the message to the socket server
      socket.emit("send_message", messageData);

      // Update the local state
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
        <img src="../icons/doctor-icon.png" alt="Doctor" className="h-10 w-10 rounded-full mr-4" />
        <h1 className="text-lg font-bold">{doctorDetails.doctorName || "Doctor"}</h1>
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