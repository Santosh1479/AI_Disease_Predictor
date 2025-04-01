import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const socket = io(import.meta.env.SOCKET, {});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

const ChatPage = () => {
  const { roomId } = useParams(); // Get the room ID from the URL
  const { doctorDetails, setDoctorDetails } = useContext(DoctorContext); // Get doctor details from context
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
    
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/doctors/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        setDoctorDetails({
          doctorId: response.data.id,
          doctorName: `${response.data.firstname} ${response.data.lastname}`,
        });
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        // Fetch old messages for the chat room
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/messages/doctor/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              doctorId: doctorDetails.doctorId, // Pass doctorId if needed
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

    fetchDoctorDetails();
    fetchMessages();

    // Listen for new messages from the socket
    socket.on("receive_message", (data) => {
      if (data.room === roomId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [roomId, doctorDetails.doctorId, setDoctorDetails]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      room: roomId,
      author: doctorDetails.doctorName || "Doctor",
      message: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center bg-blue-500 text-white p-4 shadow-md">
        <img
          src="/icons/doctor-icon.png"
          alt="Doctor"
          className="w-10 h-10 rounded-full mr-3"
        />
        <h1 className="text-lg font-bold">{doctorDetails.doctorName || "Doctor"}</h1>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.author === doctorDetails.doctorName ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.author === doctorDetails.doctorName
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