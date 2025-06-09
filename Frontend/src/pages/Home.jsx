import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import "remixicon/fonts/remixicon.css";
import { LanguageContext } from "../context/LanguageContext";
import { io } from "socket.io-client";
import { UserSocketContext } from "../context/UserSocketContext";

const translations = {
  en: {
    enterSymptoms: "Enter Your Symptoms",
    symptoms: "Symptoms",
    description: "Description",
    uploadImage: "Upload Image",
    submit: "Submit",
    logout: "Logout",
    loading: "Loading...",
    preferredLanguage: "Preferred Language",
  },
  hi: {
    enterSymptoms: "अपने लक्षण दर्ज करें",
    symptoms: "लक्षण",
    description: "विवरण",
    uploadImage: "छवि अपलोड करें",
    submit: "जमा करें",
    logout: "लॉग आउट",
    loading: "लोड हो रहा है...",
    preferredLanguage: "पसंदीदा भाषा",
  },
  kn: {
    enterSymptoms: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ನಮೂದಿಸಿ",
    symptoms: "ಲಕ್ಷಣಗಳು",
    description: "ವಿವರಣೆ",
    uploadImage: "ಚಿತ್ರವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    submit: "ಸಲ್ಲಿಸು",
    logout: "ಲಾಗ್ ಔಟ್",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    preferredLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ",
  },
};

const Home = () => {
  const [user, setUser] = useState(UserContext.user);
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState(
    "itching, skin_rash, nodal_skin_eruptions, dischromic _patches"
  );
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("HI");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage } = useContext(LanguageContext);
  const t = translations[language];
  const socketRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useContext(UserSocketContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (userId) {
          // Wait a moment to let socket update DB
          await new Promise((resolve) => setTimeout(resolve, 300));
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/users/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("User data fetched:", response.data);
          setUser({
            id: response.data._id,
            email: response.data.email,
            fullname: {
              firstname: response.data.fullname.firstname,
              lastname: response.data.fullname.lastname,
            },
            isOnline: response.data.isOnline, // <-- add this if you want to use it
          });
          setName(
            `${response.data.fullname.firstname} ${response.data.fullname.lastname}`
          );
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    if (!socket) return;
    socket.on("connect", fetchUserData);
    return () => socket.off("connect", fetchUserData);
  }, [socket]);

  useEffect(() => {
    // Fetch chats and set unreadCount
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat/user-chat-rooms`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const unread = response.data.reduce(
          (sum, room) => sum + (room.unreadMessages || 0),
          0
        );
        setUnreadCount(unread);
      } catch (error) {
        // handle error
      }
    };
    fetchChats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const combinedInput = `${symptoms} ${description}`
      .split(/\s+/)
      .filter((word) => word.length >= 3)
      .join(",");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_ML_URL}/predict`,
        { symptoms: combinedInput.split(",") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Use response.data.predicted_disease instead of response.data.disease
      navigate("/results", {
        state: { disease: response.data.predicted_disease, username: name },
      });
    } catch (error) {
      console.error("Failed to submit diagnosis", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (socket) {
        socket.disconnect();
      }
      // Remove token and userId from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.dispatchEvent(new Event("storage"));

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center w-full h-12 bg-blue-500">
        <div className="flex justify-center items-center">
          <i className="ri-user-fill text-xl h-8 w-14 pl-5"></i>
          <p>{name}</p>
          <div className="absolute right-1 mt-2">
            {/* Hamburger icon */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 focus:outline-none relative"
            >
              <i className="ri-menu-line text-2xl text-white"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-200 rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/userchats"); // Change this to your messages route
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  Messages{" "}
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{t.enterSymptoms}</h2>
        <label className="block text-xl mb-4 font-medium text-gray-900 text-center">
          {t.preferredLanguage}
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#eeeeee] mb-5 rounded px-4 py-1 border text-lg placeholder:text-sm w-full"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="kn">ಕನ್ನಡ</option>
        </select>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader">{t.loading}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t.symptoms}
              </label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t.description}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t.uploadImage}
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {t.submit}
            </button>
          </form>
        )}
        {image && (
          <button
            onClick={handleImageUpload}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Upload Image
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
