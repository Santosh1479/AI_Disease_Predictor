import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem("token");

        // Make the logout request to the correct endpoint
        await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Clear localStorage and navigate to login
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    logout();
  }, [navigate]);

  return null; // No UI needed for logout
};

export default UserLogout;