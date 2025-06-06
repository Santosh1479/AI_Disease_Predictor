import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { DoctorContext } from "../context/DoctorContext";
import { useContext } from "react";

const diseaseToSector = {
  "hypertensive  disease": "Cardiology",
  "diabetes": "Endocrinology",
  "depression  mental": "Psychiatry",
  "depressive disorder": "Psychiatry",
  "coronary  arteriosclerosis": "Cardiology",
  "coronary heart disease": "Cardiology",
  "pneumonia": "Pulmonology",
  "failure  heart congestive": "Cardiology",
  "accident  cerebrovascular": "Neurology",
  "asthma": "Pulmonology",
  "myocardial  infarction": "Cardiology",
  "hypercholesterolemia": "Cardiology",
  "infection": "Infectious Disease",
  "infection  urinary tract": "Urology",
  "anemia": "Hematology",
  "chronic  obstructive airway disease": "Pulmonology",
  "dementia": "Neurology",
  "insufficiency  renal": "Nephrology",
  "confusion": "Neurology",
  "degenerative  polyarthritis": "Rheumatology",
  "hypothyroidism": "Endocrinology",
  "anxiety  state": "Psychiatry",
  "malignant  neoplasms": "Oncology",
  "primary malignant neoplasm": "Oncology",
  "acquired  immuno-deficiency  syndrome": "Infectious Disease",
  "HIV": "Infectious Disease",
  "hiv infections": "Infectious Disease",
  "cellulitis": "Dermatology",
  "gastroesophageal  reflux disease": "Gastroenterology",
  "septicemia": "Infectious Disease",
  "systemic  infection": "Infectious Disease",
  "sepsis (invertebrate)": "Infectious Disease",
  "deep  vein thrombosis": "Vascular Medicine",
  "dehydration": "Internal Medicine",
  "neoplasm": "Oncology",
  "embolism  pulmonary": "Pulmonology",
  "epilepsy": "Neurology",
  "cardiomyopathy": "Cardiology",
  "chronic  kidney failure": "Nephrology",
  "carcinoma": "Oncology",
  "hepatitis  C": "Gastroenterology",
  "peripheral  vascular disease": "Cardiology",
  "psychotic  disorder": "Psychiatry",
  "hyperlipidemia": "Cardiology",
  "bipolar  disorder": "Psychiatry",
  "obesity": "Endocrinology",
  "ischemia": "Cardiology",
  "cirrhosis": "Gastroenterology",
  "exanthema": "Dermatology",
  "benign  prostatic hypertrophy": "Urology",
  "kidney  failure acute": "Nephrology",
  "mitral  valve insufficiency": "Cardiology",
  "arthritis": "Rheumatology",
  "bronchitis": "Pulmonology",
  "hemiparesis": "Neurology",
  "osteoporosis": "Orthopedics",
  "transient  ischemic attack": "Neurology",
  "adenocarcinoma": "Oncology",
  "paranoia": "Psychiatry",
  "pancreatitis": "Gastroenterology",
  "incontinence": "Urology",
  "paroxysmal  dyspnea": "Pulmonology",
  "hernia": "Surgery",
  "malignant  neoplasm of prostate": "Oncology",
  "carcinoma prostate": "Oncology",
  "edema  pulmonary": "Cardiology",
  "lymphatic  diseases": "Oncology",
  "stenosis  aortic valve": "Cardiology",
  "malignant  neoplasm of breast": "Oncology",
  "carcinoma breast": "Oncology",
  "schizophrenia": "Psychiatry",
  "diverticulitis": "Gastroenterology",
  "overload  fluid": "Nephrology",
  "ulcer  peptic": "Gastroenterology",
  "osteomyelitis": "Infectious Disease",
  "gastritis": "Gastroenterology",
  "bacteremia": "Infectious Disease",
  "failure  kidney": "Nephrology",
  "sickle  cell anemia": "Hematology",
  "failure  heart": "Cardiology",
  "upper  respiratory infection": "Pulmonology",
  "hepatitis": "Gastroenterology",
  "hypertension  pulmonary": "Cardiology",
  "deglutition  disorder": "ENT",
  "gout": "Rheumatology",
  "thrombocytopaenia": "Hematology",
  "hypoglycemia": "Endocrinology",
  "pneumonia  aspiration": "Pulmonology",
  "colitis": "Gastroenterology",
  "diverticulosis": "Gastroenterology",
  "suicide  attempt": "Psychiatry",
  "Pneumocystis  carinii pneumonia": "Infectious Disease",
  "hepatitis  B": "Gastroenterology",
  "parkinson  disease": "Neurology",
  "lymphoma": "Oncology",
  "hyperglycemia": "Endocrinology",
  "encephalopathy": "Neurology",
  "tricuspid  valve insufficiency": "Cardiology",
  "Alzheimer's  disease": "Neurology",
  "candidiasis": "Infectious Disease",
  "oral  candidiasis": "Infectious Disease",
  "neuropathy": "Neurology",
  "kidney  disease": "Nephrology",
  "fibroid  tumor": "Gynecology",
  "glaucoma": "Ophthalmology",
  "neoplasm  metastasis": "Oncology",
  "malignant  tumor of colon": "Oncology",
  "carcinoma colon": "Oncology",
  "ketoacidosis  diabetic": "Endocrinology",
  "tonic-clonic  epilepsy": "Neurology",
  "tonic-clonic seizures": "Neurology",
  "respiratory  failure": "Pulmonology",
  "melanoma": "Dermatology",
  "gastroenteritis": "Gastroenterology",
  "malignant  neoplasm of lung": "Oncology",
  "carcinoma of lung": "Oncology",
  "manic  disorder": "Psychiatry",
  "personality  disorder": "Psychiatry",
  "primary  carcinoma of the liver cells": "Oncology",
  "emphysema  pulmonary": "Pulmonology",
  "hemorrhoids": "Gastroenterology",
  "spasm  bronchial": "Pulmonology",
  "aphasia": "Neurology",
  "obesity  morbid": "Endocrinology",
  "pyelonephritis": "Urology",
  "endocarditis": "Infectious Disease",
  "effusion  pericardial": "Cardiology",
  "pericardial effusion body substance": "Cardiology",
  "chronic  alcoholic intoxication": "Psychiatry",
  "pneumothorax": "Pulmonology",
  "delirium": "Neurology",
  "neutropenia": "Hematology",
  "hyperbilirubinemia": "Gastroenterology",
  "influenza": "Infectious Disease",
  "dependence": "Psychiatry",
  "thrombus": "Cardiology",
  "cholecystitis": "Gastroenterology",
  "hernia  hiatal": "Gastroenterology",
  "migraine  disorders": "Neurology",
  "pancytopenia": "Hematology",
  "cholelithiasis": "Gastroenterology",
  "biliary  calculus": "Gastroenterology",
  "tachycardia  sinus": "Cardiology",
  "ileus": "Gastroenterology",
  "adhesion": "Surgery",
  "delusion": "Psychiatry",
  "affect  labile": "Psychiatry",
  "decubitus  ulcer": "Dermatology"
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
              <div className="mt-2">
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">Select a doctor</option>
                  {hospital.doctors &&
                    hospital.doctors.map((doctor, index) => (
                      <option key={index} value={doctor._id}>
                        {doctor.fullname.firstname} {doctor.fullname.lastname} -{" "}
                        {doctor.specialisation}
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