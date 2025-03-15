import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io('http://localhost:3000', {
  withCredentials: true,
});

const DoctorHome = () => {
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const token = localStorage.getItem("token");
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
  }, []);

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