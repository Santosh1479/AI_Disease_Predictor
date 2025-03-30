import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

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
        fetchChatRooms(); // Log the profile for debugging
      } catch (error) {
        console.error("Error fetching doctor profile:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
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
        console.error(
          "Error fetching chat rooms:",
          error.response?.data || error.message
        );
      }
    };

    fetchDoctorProfile();

    socket.on("receive_message", (data) => {
      setChatRooms((prevChatRooms) => {
        const updatedChatRooms = prevChatRooms.map((room) => {
          if (room._id === data.room) {
            return {
              ...room,
              messages: [...room.messages, data],
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

  const handleChatRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`); // Navigate to the chat page with the room ID
  };

  return (
    <div className="container mx-auto p-4 flex h-screen">
      <div className="w-full border-r border-gray-300 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Texts</h2>
        {chatRooms.map((room, index) => (
          <div
            key={index}
            className="p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleChatRoomClick(room._id)}
          >
            {room.userName && (
              <div className="flex w-90% bg-gray-200 h-12 items-center rounded-3xl gap-2">
                <div className="h-10 w-10 ml-4 bg-gray-300 flex items-center justify-center rounded-full">
                  <i className="text-2xl font-bold ri-user-line"></i>
                </div>
                <h3 className="text-2xl font-semibold">{room.userName}</h3>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorHome;