import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();

  axios
    .get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId"); // Remove user ID from localStorage
        Navigate("/login");
      }
    });

  return <div>UserLogout</div>;
};

export default UserLogout;
