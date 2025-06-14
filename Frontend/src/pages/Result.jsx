import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { DoctorContext } from "../context/DoctorContext";
import { useContext } from "react";

const diseaseToSector = {
  "fungal infection": "Dermatology",
  allergy: "Immunology",
  gerd: "Gastroenterology",
  "chronic cholestasis": "Gastroenterology",
  "drug reaction": "Dermatology",
  "peptic ulcer diseae": "Gastroenterology",
  aids: "Infectious Disease",
  diabetes: "Endocrinology",
  gastroenteritis: "Gastroenterology",
  "bronchial asthma": "Pulmonology",
  hypertension: "Cardiology",
  migraine: "Neurology",
  "cervical spondylosis": "Orthopedics",
  "paralysis (brain hemorrhage)": "Neurology",
  jaundice: "Hepatology",
  malaria: "Infectious Disease",
  "chicken pox": "Infectious Disease",
  dengue: "Infectious Disease",
  typhoid: "Infectious Disease",
  "hepatitis a": "Hepatology",
  "hepatitis b": "Hepatology",
  "hepatitis c": "Hepatology",
  "hepatitis d": "Hepatology",
  "hepatitis e": "Hepatology",
  "alcoholic hepatitis": "Hepatology",
  tuberculosis: "Pulmonology",
  "common cold": "General Medicine",
  pneumonia: "Pulmonology",
  "dimorphic hemmorhoids(piles)": "General Surgery",
  "heart attack": "Cardiology",
  "varicose veins": "Vascular Surgery",
  hypothyroidism: "Endocrinology",
  hyperthyroidism: "Endocrinology",
  hypoglycemia: "Endocrinology",
  osteoarthristis: "Rheumatology",
  arthritis: "Rheumatology",
  "(vertigo) paroymsal  positional vertigo": "Neurology",
  acne: "Dermatology",
  "urinary tract infection": "Urology",
  psoriasis: "Dermatology",
  impetigo: "Dermatology",
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { disease, username } = location.state || {}; // Safely retrieve disease and username
  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const { doctorDetails, setDoctorDetails } = useContext(DoctorContext);

  useEffect(() => {
    if (!disease) {
      console.error("Disease is undefined");
      return;
    }

    const fetchHospitalsAndDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const [hospitalsResponse, doctorsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const allHospitals = hospitalsResponse.data;
        const allDoctors = doctorsResponse.data;

        // Normalize disease name
        const normalizedDisease = disease.toLowerCase().trim();

        // Filter doctors by specialization
        const filteredDoctors = allDoctors.filter(
          (doctor) =>
            doctor.specialisation === diseaseToSector[normalizedDisease]
        );

        // Map doctors to their respective hospitals
        const hospitalsWithDoctors = allHospitals.map((hospital) => ({
          ...hospital,
          doctors: filteredDoctors.filter(
            (doctor) => doctor.hospital.toString() === hospital._id.toString()
          ),
        }));

        // Filter out hospitals without specialized doctors
        const filteredHospitals = hospitalsWithDoctors.filter(
          (hospital) => hospital.doctors.length > 0
        );

        // Get user location
        navigator.geolocation.getCurrentPosition((position) => {
          const userLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(userLoc);

          // Calculate distance and sort hospitals
          const sortedHospitals = filteredHospitals
            .map((hospital) => {
              const distance = getDistance(userLoc, {
                latitude: hospital.latitude,
                longitude: hospital.longitude,
              });
              return { ...hospital, distance };
            })
            .sort((a, b) => a.distance - b.distance);

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
      Math.cos(loc1.latitude * (Math.PI / 180)) *
        Math.cos(loc2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const sendMessage = async () => {
    if (message.trim() !== "" && selectedDoctor !== "") {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken._id;
          const userName = username; // Assuming username is passed via location.state
          const doctor = hospitals
            .flatMap((hospital) => hospital.doctors)
            .find((doc) => doc._id === selectedDoctor);

          if (!doctor) {
            console.error("Doctor not found");
            return;
          }

          const doctorName = `${doctor.fullname.firstname} ${doctor.fullname.lastname}`;

          // Create chat room
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/chat/create`,
            {
              userId,
              userName,
              doctorId: selectedDoctor,
              doctorName,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setDoctorDetails({
            doctorId: selectedDoctor,
            doctorName: doctorName,
          });

          const { roomId } = response.data;

          // Redirect to chat page
          navigate(`/chat/${roomId}`, {
            state: { roomId, userId, doctorId: selectedDoctor, doctorName },
          });
        }
      } catch (error) {
        console.error("Failed to create chat room", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-blue-500 text-white p-4 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Diagnosis Result:</h1>
        <h2 className="text-xl font-semibold">Predicted Disease</h2>
        <p className="text-gray-800 text-xl">{disease || "Unknown"}</p>
        <p className="text-gray-800">
          Sector: {diseaseToSector[disease?.toLowerCase()?.trim()] || "Unknown"}
        </p>
      </div>
      <div className="bg-blue-100 rounded-xl mt-4 p-4">
        <h2 className="text-lg font-semibold mb-4">
          Hospitals with Specialized Treatment
        </h2>
        <ul className="list-disc list-inside">
          {hospitals.map((hospital, index) => (
            <li key={index} className="text-gray-700 mb-4">
              <div className="font-bold">
                {hospital.name} ({hospital.distance.toFixed(2)} km)
              </div>
              <div>{hospital.address}</div>
              {hospital.doctors && hospital.doctors.length > 0 && (
                <div className="mt-2 space-y-2">
                  {hospital.doctors.map((doctor, index) => (
                    <div
                      key={doctor._id}
                      className="flex items-center justify-between bg-white rounded shadow px-3 py-2 mb-2"
                    >
                      <span>
                        {doctor.fullname.firstname} {doctor.fullname.lastname} -{" "}
                        {doctor.specialisation}
                      </span>
                      <button
                        className="text-blue-600 hover:text-blue-800 ml-2"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            if (token) {
                              const decodedToken = jwtDecode(token);
                              const userId = decodedToken._id;
                              const userName = username;
                              const doctorName = `${doctor.fullname.firstname} ${doctor.fullname.lastname}`;
                              // Create chat room
                              const response = await axios.post(
                                `${import.meta.env.VITE_BASE_URL}/chat/create`,
                                {
                                  userId,
                                  userName,
                                  doctorId: doctor._id,
                                  doctorName,
                                },
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );
                              setDoctorDetails({
                                doctorId: doctor._id,
                                doctorName: doctorName,
                              });
                              const { roomId } = response.data;
                              navigate(`/chat/${roomId}`, {
                                state: {
                                  roomId,
                                  userId,
                                  doctorId: doctor._id,
                                  doctorName,
                                },
                              });
                            }
                          } catch (error) {
                            console.error("Failed to create chat room", error);
                          }
                        }}
                        title="Message Doctor"
                      >
                        <i className="ri-message-3-line text-xl"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Result;
