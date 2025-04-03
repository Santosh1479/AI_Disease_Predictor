import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorLogout = () => {
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();

  axios
  .get(`${import.meta.env.VITE_BASE_URL}/doctor/logout`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    if (response.status === 200) {
      localStorage.removeItem("token");
      localStorage.removeItem("doctorId"); // Remove doctor ID from localStorage
      Navigate("/doctor-login");
    }
  });
  return <div>Doctor Logout</div>;
};

export default DoctorLogout;
