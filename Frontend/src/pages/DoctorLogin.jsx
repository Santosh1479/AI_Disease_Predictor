import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const doctorData = {
      email: email,
      password: pass,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctors/login`,
        doctorData
      );
      if (response.status === 200) {
        const data = response.data;
        setUser(data.doctor);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }

    setEmail("");
    setPass("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className=" w-20 mb-10"
          src="icons/doclogo.png"
          alt="IMG"
        />

        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-xl font-bold mb-2">What's your Email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-xl font-bold mb-2">Enter Password</h3>
          <input
            required
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="password"
            placeholder="Password"
          />

          <button className="bg-[#111111] text-white mb-3 rounded px-4 py-2 border text-lg  w-full">
            Login
          </button>
        </form>
        <p className="text-center">
          New here?..
          <Link to={"/doctor-signup"} className="text-blue-500">
            Create new Account
          </Link>
        </p>
        <div className="mt-16 mb-5 w-400 h-10 text-center flex items-center justify-center text-white test-2xl font-bold rounded-xl bg-blue-500">
          <Link to={"/login"} className="text-white">
            User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
