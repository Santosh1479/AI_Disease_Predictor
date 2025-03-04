// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// const Result = () => {
//   const location = useLocation();
//   const { disease } = location.state || { disease: 'Cancer' };
//   const [predictionPercentage, setPredictionPercentage] = useState('');
//   const [hospitals, setHospitals] = useState([]);
//   const [userLocation, setUserLocation] = useState(null);
//   const [message, setMessage] = useState('');
//   const [selectedDoctor, setSelectedDoctor] = useState('');

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/results`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//         setPredictionPercentage(response.data.predictionPercentage);
//         const location = await getUserLocation();
//         setUserLocation(location);
//         const allHospitals = await fetchHospitals();
//         const filteredHospitals = filterHospitalsBySpecialisation(allHospitals, disease);
//         const sortedHospitals = sortHospitalsByDistance(filteredHospitals, location);
//         setHospitals(sortedHospitals);
//       } catch (error) {
//         console.error('Error fetching results:', error);
//       }
//     };

//     fetchResults();
//   }, [disease]);

//   const getUserLocation = () => {
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const userLocation = {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           };
//           resolve(userLocation);
//         },
//         (error) => {
//           reject(error);
//         },
//         {
//           enableHighAccuracy: true,
//           maximumAge: 0,
//           timeout: 10000,
//         }
//       );
//     });
//   };

//   const fetchHospitals = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals/all`);
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch hospitals", error);
//       return [];
//     }
//   };

//   const filterHospitalsBySpecialisation = (hospitals, specialisation) => {
//     return hospitals.filter((hospital) =>
//       hospital.specialisations.includes(specialisation)
//     );
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const toRadians = (degrees) => (degrees * Math.PI) / 180;

//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRadians(lat1)) *
//         Math.cos(toRadians(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in kilometers
//   };

//   const sortHospitalsByDistance = (hospitals, userLocation) => {
//     return hospitals.sort((a, b) => {
//       const distanceA = calculateDistance(
//         userLocation.latitude,
//         userLocation.longitude,
//         a.latitude,
//         a.longitude
//       );
//       const distanceB = calculateDistance(
//         userLocation.latitude,
//         userLocation.longitude,
//         b.latitude,
//         b.longitude
//       );
//       return distanceA - distanceB;
//     });
//   };

//   const sendMessage = async () => {
//     if (message.trim() !== '' && selectedDoctor !== '') {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}/users/profile`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const userName = `${response.data.fullname.firstname} ${response.data.fullname.lastname}`;
//         const messageData = {
//           author: userName,
//           message: message,
//           time: new Date().toLocaleTimeString(),
//           room: selectedDoctor,
//         };
//         await axios.post(`${import.meta.env.VITE_BASE_URL}/messages`, messageData);
//         setMessage('');
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div className="bg-blue-500 text-white p-4 rounded shadow-md h-1/4 w-full">
//         <h1 className="text-2xl font-bold mb-4">Diagnosis Result:</h1>
//         <div className="">
//           <h2 className="text-xl font-semibold">Predicted Disease</h2>
//           <p className="text-gray-800 text-xl">{disease}</p>
//           <p className="text-gray-800">{predictionPercentage}%</p>
//         </div>
//       </div>
//       <div className="bg-blue-100 h-screen rounded-xl">
//         <h2 className="text-lg font-semibold m-2 p-2">Hospitals with Specialized Treatment</h2>
//         <ul className="list-disc list-inside">
//           {hospitals.map((hospital, index) => (
//             <li key={index} className="text-gray-700 mb-2">
//               {hospital.name} - {hospital.address}
//               <div className="mt-2">
//                 <select
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   onChange={(e) => setSelectedDoctor(e.target.value)}
//                 >
//                   <option value="">Select a doctor</option>
//                   {hospital.doctors
//                     .filter((doctor) => doctor.specialization === disease)
//                     .map((doctor, index) => (
//                       <option key={index} value={doctor._id}>
//                         {doctor.name} - {doctor.specialization}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//               <div className="mt-2">
//                 <input
//                   type="text"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   placeholder="Type your message here..."
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
//                 >
//                   Send
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Result;

// dummy hosp data

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// const Result = () => {
//   const location = useLocation();
//   const { disease } = location.state || { disease: "Cancer" };
//   const [predictionPercentage, setPredictionPercentage] = useState("85");
//   const [hospitals, setHospitals] = useState([]);
//   const [message, setMessage] = useState("");
//   const [selectedDoctor, setSelectedDoctor] = useState("");

//   useEffect(() => {
//     // Dummy data for hospitals and doctors
//     const dummyHospitals = [
//       {
//         name: "City Hospital",
//         address: "123 Main St, Cityville",
//         phone: "+1234567890",
//         doctors: [
//           { _id: "1", name: "Dr. Smith", specialization: "Cancer" },
//           { _id: "2", name: "Dr. Johnson", specialization: "Cardiology" },
//         ],
//       },
//       {
//         name: "Town Clinic",
//         address: "456 Elm St, Townsville",
//         phone: "+0987654321",
//         doctors: [
//           { _id: "3", name: "Dr. Brown", specialization: "Cancer" },
//           { _id: "4", name: "Dr. Davis", specialization: "Neurology" },
//         ],
//       },
//       {
//         name: "Town Clinic1",
//         address: "4561 Elm St, Townsville",
//         phone: "+0987654321",
//         doctors: [
//           { _id: "5", name: "Dr. Brown", specialization: "Orthopedics" },
//           { _id: "6", name: "Dr. Davis", specialization: "Neurology" },
//         ],
//       },
//     ];

//     // Filter hospitals by specialization
//     const filteredHospitals = dummyHospitals.filter((hospital) =>
//       hospital.doctors.some((doctor) => doctor.specialization === disease)
//     );

//     setHospitals(filteredHospitals);
//   }, [disease]);

//   const sendMessage = () => {
//     if (message.trim() !== "" && selectedDoctor !== "") {
//       console.log("Message sent:", message);
//       setMessage("");
//     }
//   };

//   const handlePhoneClick = (phone) => {
//     const whatsappUrl = `https://wa.me/${phone}`;
//     if (window.confirm("Do you want to make a call?")) {
//       window.location.href = `tel:${phone}`;
//     } else {
//       window.open(whatsappUrl, "_blank");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div className="bg-blue-500 text-white p-4 rounded shadow-md h-1/4 w-full">
//         <h1 className="text-2xl font-bold mb-4">Diagnosis Result:</h1>
//         <div className="">
//           <h2 className="text-xl font-semibold">Predicted Disease</h2>
//           <p className="text-gray-800 text-xl">{disease}</p>
//           <p className="text-gray-800">{predictionPercentage}%</p>
//         </div>
//       </div>
//       <div className="bg-blue-100 h-screen rounded-xl mt-4 p-4">
//         <h2 className="text-lg font-semibold mb-4">
//           Hospitals with Specialized Treatment
//         </h2>
//         <ul className="list-disc list-inside">
//           {hospitals.map((hospital, index) => (
//             <li key={index} className="text-gray-700 mb-4">
//               <div className="flex justify-between items-center">
//                 <div className="font-bold">{hospital.name}</div>
//                 <button
//                   onClick={() => handlePhoneClick(hospital.phone)}
//                   className="text-blue-500 hover:text-blue-700"
//                 >
//                   <i className="ri-phone-line text-xl font-bold pl-10"></i>
//                 </button>
//               </div>
//               <div>{hospital.address}</div>
//               <div className="mt-2">
//                 <select
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   onChange={(e) => setSelectedDoctor(e.target.value)}
//                 >
//                   <option value="">Select a doctor</option>
//                   {hospital.doctors
//                     .filter((doctor) => doctor.specialization === disease)
//                     .map((doctor, index) => (
//                       <option key={index} value={doctor._id}>
//                         {doctor.name} - {doctor.specialization}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//               <div className="mt-2">
//                 <input
//                   type="text"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   placeholder="Type your message here..."
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
//                 >
//                   Send
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Result;
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
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals/all`);
        const allHospitals = response.data;

        console.log("Fetched hospitals:", allHospitals);

        // Normalize disease name
        const normalizedDisease = disease.toLowerCase().trim();
        console.log("Normalized disease:", normalizedDisease);

        // Filter hospitals by specialisations
        console.log("Disease to sector:", diseaseToSector[normalizedDisease]);
        const filteredHospitals = allHospitals.filter((hospital) =>
          hospital.specialisations && hospital.specialisations.includes(diseaseToSector[normalizedDisease])
        );

        console.log("Filtered hospitals:", filteredHospitals);

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
        console.error("Failed to fetch hospitals", error);
      }
    };

    fetchHospitals();
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
                      {doctor.name} - {doctor.specialisation}
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