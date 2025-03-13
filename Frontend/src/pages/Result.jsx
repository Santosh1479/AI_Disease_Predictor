import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const diseaseToSector = {
  "fungal infection": "Dermatology",
  "allergy": "Dermatology",
  "gerd": "Gastroenterology",
  "chronic cholestasis": "Gastroenterology",
  "drug reaction": "Dermatology",
  "peptic ulcer disease": "Gastroenterology",
  "aids": "Infectious Disease",
  "diabetes": "Endocrinology",
  "gastroenteritis": "Gastroenterology",
  "bronchial asthma": "Pulmonology",
  "hypertension": "Cardiology",
  "migraine": "Neurology",
  "cervical spondylosis": "Orthopedics",
  "paralysis (brain hemorrhage)": "Neurology",
  "jaundice": "Gastroenterology",
  "malaria": "Infectious Disease",
  "chicken pox": "Infectious Disease",
  "dengue": "Infectious Disease",
  "typhoid": "Infectious Disease",
  "hepatitis a": "Gastroenterology",
  "hepatitis b": "Gastroenterology",
  // Add more mappings as needed
};

const Result = () => {
  const location = useLocation();
  const { disease } = location.state || { disease: "" };
  const [predictionPercentage, setPredictionPercentage] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchHospitalsAndDoctors = async () => {
      try {
        const [hospitalsResponse, doctorsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals/all`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/all`)
        ]);

        const allHospitals = hospitalsResponse.data;
        const allDoctors = doctorsResponse.data;

        console.log("Fetched hospitals:", allHospitals);
        console.log("Fetched doctors:", allDoctors);

        // Normalize disease name
        const normalizedDisease = disease.toLowerCase().trim();
        console.log("Normalized disease:", normalizedDisease);

        // Filter doctors by specialization
        const filteredDoctors = allDoctors.filter(
          (doctor) => doctor.specialisation === diseaseToSector[normalizedDisease]
        );

        console.log("Filtered doctors:", filteredDoctors);

        // Map doctors to their respective hospitals
        const hospitalsWithDoctors = allHospitals.map((hospital) => ({
          ...hospital,
          doctors: filteredDoctors.filter((doctor) => doctor.hospital.toString() === hospital._id.toString())
        }));

        // Filter out hospitals without specialized doctors
        const filteredHospitals = hospitalsWithDoctors.filter(hospital => hospital.doctors.length > 0);

        console.log("Hospitals with specialized doctors:", filteredHospitals);

        // Get user location
        navigator.geolocation.getCurrentPosition((position) => {
          const userLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(userLoc);

          // Calculate distance and sort hospitals
          const sortedHospitals = filteredHospitals.map((hospital) => {
            const distance = getDistance(userLoc, {
              latitude: hospital.latitude,
              longitude: hospital.longitude,
            });
            return { ...hospital, distance };
          }).sort((a, b) => a.distance - b.distance);

          setHospitals(sortedHospitals);
        });
      } catch (error) {
        console.error("Failed to fetch hospitals or doctors", error);
      }
    };

    fetchHospitalsAndDoctors();
  }, [disease]);

  const getDistance = (loc1, loc2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.latitude - loc1.latitude) * (Math.PI / 180);
    const dLon = (loc2.longitude - loc1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.latitude * (Math.PI / 180)) * Math.cos(loc2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const sendMessage = () => {
    if (message.trim() !== "" && selectedDoctor !== "") {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  const handlePhoneClick = (phone) => {
    const whatsappUrl = `https://wa.me/${phone}`;
    if (window.confirm("Do you want to make a call?")) {
      window.location.href = `tel:${phone}`;
    } else {
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-blue-500 text-white p-4 rounded shadow-md h-1/4 w-full">
        <h1 className="text-2xl font-bold mb-4">Diagnosis Result:</h1>
        <div className="">
          <h2 className="text-xl font-semibold">Predicted Disease</h2>
          <p className="text-gray-800 text-xl">{disease}</p>
          {predictionPercentage && <p className="text-gray-800">{predictionPercentage}%</p>}
          <p className="text-gray-800">Sector: {diseaseToSector[disease.toLowerCase().trim()] || "Unknown"}</p>
        </div>
      </div>
      <div className="bg-blue-100 h-screen rounded-xl mt-4 p-4">
        <h2 className="text-lg font-semibold mb-4">
          Hospitals with Specialized Treatment
        </h2>
        <ul className="list-disc list-inside">
          {hospitals.map((hospital, index) => (
            <li key={index} className="text-gray-700 mb-4">
              <div className="flex justify-between items-center">
                <div className="font-bold">{hospital.name} ({hospital.distance.toFixed(2)} km)</div>
                <button
                  onClick={() => handlePhoneClick(hospital.phone)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <i className="ri-phone-line text-xl font-bold pl-10"></i>
                </button>
              </div>
              <div>{hospital.address}</div>
              <div className="mt-2">
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">Select a doctor</option>
                  {hospital.doctors && hospital.doctors.map((doctor, index) => (
                    <option key={index} value={doctor._id}>
                      {doctor.fullname.firstname} {doctor.fullname.lastname} - {doctor.specialisation}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Type your message here..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                >
                  Send
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Result;