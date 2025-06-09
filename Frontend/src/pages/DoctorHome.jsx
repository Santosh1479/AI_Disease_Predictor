import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DoctorSocketContext } from "../context/DoctorSocketContext";

const DoctorHome = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();
  const socket = useContext(DoctorSocketContext);

  // Move these functions OUTSIDE of useEffect!
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChatRooms((prev) =>
        response.data.map((room) => {
          const prevRoom = prev.find(
            (r) =>
              (typeof r.userId === "object" ? r.userId._id : r.userId) ===
              (typeof room.userId === "object" ? room.userId._id : room.userId)
          );
          return {
            ...room,
            isOnline: prevRoom ? prevRoom.isOnline : false,
          };
        })
      );
      console.log("Chat rooms fetched:", response.data);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const fetchDoctorProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/doctor-login");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/doctors/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Doctor profile:", response.data);
      fetchChatRooms();
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();

    if (socket) {
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
                    : 0,
              };
            }
            return room;
          });
          return updatedChatRooms;
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [navigate, socket]);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("Doctor socket connected!", socket.id);
    });
    return () => socket.off("connect");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("currentOnlineUsers", ({ userIds }) => {
      setChatRooms((prev) =>
        prev.map((room) => {
          const roomUserId = (
            typeof room.userId === "object" ? room.userId._id : room.userId
          )
            ?.toString()
            .trim();
          const online = userIds
            .map((id) => id.toString().trim())
            .includes(roomUserId);
          console.log("Rendering room", roomUserId, "isOnline:", online);
          return { ...room, isOnline: online };
        })
      );
    });
    return () => socket.off("currentOnlineUsers");
  }, [socket]);

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
        {chatRooms.map((room, index) => {
          console.log(
            "Rendering room",
            room.userId,
            "isOnline:",
            room.isOnline
          );
          return (
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
              <p className="text-sm text-gray-500 truncate">
                {room.lastMessage}
              </p>
              <small className="text-xs text-gray-400">
                {room.lastMessageTimestamp
                  ? new Date(room.lastMessageTimestamp).toLocaleTimeString()
                  : ""}
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorHome;
