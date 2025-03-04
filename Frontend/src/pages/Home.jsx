import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { LanguageContext } from "../context/LanguageContext";

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
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage } = useContext(LanguageContext);
  const t = translations[language];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken._id;
          if (userId) {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/users/profile`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setName(
              `${response.data.fullname.firstname} ${response.data.fullname.lastname}`
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
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
        `http://127.0.0.1:5000/diagnosis`,
        { input: combinedInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/results", { state: { disease: response.data.disease } });
    } catch (error) {
      console.error("Failed to submit diagnosis", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/upload_image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/results", { state: { disease: response.data.disease } });
    } catch (error) {
      console.error("Failed to upload image", error);
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

      localStorage.removeItem("token");
      window.location.href = "/login";
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
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 w-20 h-8 rounded-xl text-white text-sm font-bold mr-5"
        >
          {t.logout}
        </button>
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