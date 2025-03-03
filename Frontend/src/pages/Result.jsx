import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const { disease } = location.state || {};
  const [predictionPercentage, setPredictionPercentage] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/results`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPredictionPercentage(response.data.predictionPercentage);
        const location = await getUserLocation();
        setUserLocation(location);
        const allHospitals = await fetchHospitals();
        const filteredHospitals = filterHospitalsBySpecialisation(allHospitals, disease);
        const sortedHospitals = sortHospitalsByDistance(filteredHospitals, location);
        setHospitals(sortedHospitals);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, [disease]);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(userLocation);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    });
  };

  const fetchHospitals = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/hospitals/all`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
      return [];
    }
  };

  const filterHospitalsBySpecialisation = (hospitals, specialisation) => {
    return hospitals.filter((hospital) =>
      hospital.specialisations.includes(specialisation)
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const sortHospitalsByDistance = (hospitals, userLocation) => {
    return hospitals.sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.latitude,
        a.longitude
      );
      const distanceB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.latitude,
        b.longitude
      );
      return distanceA - distanceB;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-blue-500 text-white p-4 rounded shadow-md h-1/4 w-full">
        <h1 className="text-2xl font-bold mb-4">Diagnosis Result:</h1>
        <div className="">
          <h2 className="text-xl font-semibold">Predicted Disease</h2>
          <p className="text-gray-200">{disease}</p>
          <p className="text-gray-200">{predictionPercentage}%</p>
        </div>
      </div>
      <div className="bg-blue-100 h-screen rounded-xl">
        <h2 className="text-lg font-semibold m-2 p-2">Hospitals with Specialized Treatment</h2>
        <ul className="list-disc list-inside">
          {hospitals.map((hospital, index) => (
            <li key={index} className="text-gray-700 mb-2">
              {hospital.name} - {hospital.address}
              <div className="mt-2">
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option value="">Select a doctor</option>
                  {hospital.doctors.map((doctor, index) => (
                    <option key={index} value={doctor.name}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Result;