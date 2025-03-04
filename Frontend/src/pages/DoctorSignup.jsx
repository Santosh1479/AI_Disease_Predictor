import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const DoctorSignup = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [hospital, setHospital] = useState();
  const [specialisation, setSpecialisation] = useState("");
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const doctorData = {
      firstname,
      lastname,
      email,
      password: pass,
      mobileNumber,
      hospital,
      specialisation,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctors/create`,
        doctorData
      );
      if (response.status === 201) {
        const data = response.data;
        setUser(data.doctor);
        localStorage.setItem("token", data.token);
        navigate("/doctor-home");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <form onSubmit={submitHandler}>
          <h3 className="text-xl font-bold mb-2">First Name</h3>
          <input
            required
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="text"
            placeholder="First Name"
          />
          <h3 className="text-xl font-bold mb-2">Last Name</h3>
          <input
            required
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="text"
            placeholder="Last Name"
          />
          <h3 className="text-xl font-bold mb-2">Email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-xl font-bold mb-2">Password</h3>
          <input
            required
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="password"
            placeholder="Password"
          />
          <h3 className="text-xl font-bold mb-2">Mobile Number</h3>
          <input
            required
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="text"
            placeholder="Mobile Number"
          />
          <h3 className="text-lg font-medium mb-1">Enter Hospital ID</h3>
          <input
            required
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="text"
            placeholder="Hospital ID"
          />
          <h3 className="text-lg font-medium mb-1">Enter Specialisation</h3>
          <input
            required
            value={specialisation}
            onChange={(e) => setSpecialisation(e.target.value)}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border text-lg placeholder:text-sm w-full"
            type="text"
            placeholder="Specialisation"
          />
          <button className="bg-[#111111] text-white mb-3 rounded px-4 py-2 border text-lg  w-full">
            Register
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link to={"/doctor-login"} className="text-blue-500">
            Login
          </Link>
        </p>
        <div className="mt-16 mb-5 w-400 h-10 text-center flex items-center justify-center text-white test-2xl font-bold rounded-xl bg-blue-500">
          <Link to={"/signup"}>User Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;