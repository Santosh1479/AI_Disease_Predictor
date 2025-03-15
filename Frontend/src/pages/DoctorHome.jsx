import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io('http://localhost:3000', {
  withCredentials: true,
});

const DoctorHome = () => {
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
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const doctorId = response.data._id;
        setRoom(doctorId);
        socket.emit("join_room", doctorId);
        fetchMessages(doctorId);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        if (error.response && error.response.status === 401) {
          navigate("/doctor-login"); // Redirect to login if token is invalid
        }
      }
    };

    const fetchMessages = async (doctorId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/messages/doctor/${doctorId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
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
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>
              <strong>{msg.author}</strong>: {msg.message} <em>{msg.time}</em>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorHome;