import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io(import.meta.env.SOCKET, {});

const DoctorHome = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/doctor-login"); // Redirect to login if token is missing
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/doctors/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token
            },
          }
        );
        console.log("Doctor profile:", response.data);
        fetchChatRooms(); // Fetch chat rooms after fetching profile
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    const fetchChatRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat/doctor-chat-rooms`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token
            },
          }
        );
        setChatRooms(response.data); // Update state with chat rooms
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchDoctorProfile();

    socket.on("receive_message", (data) => {
      setChatRooms((prevChatRooms) => {
        const updatedChatRooms = prevChatRooms.map((room) => {
          if (room._id === data.roomId) {
            return {
              ...room,
              lastMessage: data.message,
              lastMessageTimestamp: data.timestamp,
              unreadMessages:
                data.senderId !== localStorage.getItem("userId")
                  ? room.unreadMessages + 1
                  : 0, // Reset unreadMessages for the sender
            };
          }
          return room;
        });
        return updatedChatRooms;
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [navigate]);

  const handleChatRoomClick = async (roomId) => {
    try {
      // Clear notifications for the selected chat room
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/chat/clear-notifications/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // Reset unread messages in the frontend state
      setChatRooms((prevChatRooms) =>
        prevChatRooms.map((room) =>
          room._id === roomId ? { ...room, unreadMessages: 0 } : room
        )
      );
  
      // Navigate to the chat page with the roomId
      navigate(`/chat/${roomId}`);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("doctorId");

    // Redirect to the login page
    navigate("/doctor-login");
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center w-full h-12 bg-blue-500 mb-4">
        <h2 className="text-xl font-bold text-white ml-4">Doctor Dashboard</h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Chat Rooms */}
      <div className="w-full border-r border-gray-300 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Texts</h2>
        {chatRooms.map((room, index) => (
          <div
            key={index}
            className="p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleChatRoomClick(room._id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full mr-2 ${
                    room.isOnline ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></div>
                <h3 className="text-lg font-semibold">{room.userName}</h3>
              </div>
              {room.unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {room.unreadMessages}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
            <small className="text-xs text-gray-400">
              {room.lastMessageTimestamp
                ? new Date(room.lastMessageTimestamp).toLocaleTimeString()
                : ""}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorHome;
