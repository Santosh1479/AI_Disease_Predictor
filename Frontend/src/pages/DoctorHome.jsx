// filepath: c:\Users\Santosh\Desktop\AI_Disease_Predictor\Frontend\src\pages\DoctorHome.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io('http://localhost:3000', {
  withCredentials: true,
});

const DoctorHome = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
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
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const doctorId = response.data._id;
        setRoom(doctorId);
        socket.emit("join_room", doctorId);
        fetchChatRooms(doctorId);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        if (error.response && error.response.status === 401) {
          navigate("/doctor-login"); // Redirect to login if token is invalid
        }
      }
    };

    const fetchChatRooms = async (doctorId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat/doctor-chat-rooms`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setChatRooms(response.data);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchDoctorProfile();

    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Doctor's Dashboard</h2>
      <div className="chat-rooms">
        <h3 className="text-xl font-bold mb-2">Chat Rooms</h3>
        {chatRooms.map((room, index) => (
          <div key={index} className="chat-room">
            <p>
              <strong>Room ID:</strong> {room._id}
            </p>
            <p>
              <strong>User ID:</strong> {room.userId}
            </p>
            <p>
              <strong>Messages:</strong>
            </p>
            <ul>
              {room.messages.map((msg, msgIndex) => (
                <li key={msgIndex}>
                  <strong>{msg.author}</strong>: {msg.message} <em>{msg.time}</em>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorHome;