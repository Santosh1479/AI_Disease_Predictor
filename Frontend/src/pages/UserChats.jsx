import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const UserChats = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat/user-chat-rooms`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChatRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch chats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId },
      });

      socketRef.current.on("receiveMessage", (data) => {
        setChatRooms((prev) =>
          prev.map((room) =>
            room._id === data.roomId
              ? { ...room, unreadMessages: (room.unreadMessages || 0) + 1 }
              : room
          )
        );
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage");
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (loading) return <div>Loading chats...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Chats</h2>
      {chatRooms.length === 0 ? (
        <div>No chats yet.</div>
      ) : (
        <ul>
          {chatRooms.map((room) => (
            <li
              key={room._id}
              className="flex items-center justify-between p-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => {
                // Mark as read and go to chat page
                setChatRooms((prev) =>
                  prev.map((r) =>
                    r._id === room._id ? { ...r, unreadMessages: 0 } : r
                  )
                );
                navigate(`/chat/${room._id}`);
              }}
            >
              <span>
                Dr. {room.doctorName || "Doctor"} {/* Adjust as per your data */}
              </span>
              {room.unreadMessages > 0 && (
                <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {room.unreadMessages}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserChats;