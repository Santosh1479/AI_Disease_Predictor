// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LocationSearchPanel = ({ setPanelOpen, setSelect }) => {
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNearestLocations = async (userLocation) => {
//       try {
//         const token = localStorage.getItem('token'); // or use cookies if you store the token there
//         const { data } = await axios.get("http://localhost:3000/maps/get-nearest-locations", {
//           params: {
//             origin: `${userLocation.latitude},${userLocation.longitude}`,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         if (Array.isArray(data)) {
//           setSuggestions(data);
//         } else {
//           console.error("Unexpected response format:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching nearest locations:", error);
//       }
//     };

//     const getUserLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const userLocation = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             };
//             console.log(`User Location: ${userLocation.latitude}, ${userLocation.longitude}`);
//             fetchNearestLocations(userLocation);
//           },
//           (error) => {
//             console.error("Error getting user location:", error);
//             alert("Unable to retrieve your location. Please ensure location services are enabled.");
//           },
//           {
//             enableHighAccuracy: true,
//             maximumAge: 0,
//             timeout: 10000
//           }
//         );
//       } else {
//         console.error("Geolocation is not supported by this browser.");
//         alert("Geolocation is not supported by your browser.");
//       }
//     };

//     getUserLocation();
//   }, []);

//   const handleSuggestionClick = (suggestion) => {
//     setSelect(suggestion);
//     setPanelOpen(false);
//     navigate(`/page?latitude=${suggestion.latitude}&longitude=${suggestion.longitude}`);
//   };

//   return (
//     <div className="flex flex-col items-center overflow-y-auto h-full">
//       <i
//         onClick={() => {
//           setPanelOpen(false);
//         }}
//         className="ri-arrow-down-wide-line items-center text-4xl font-bold invert "
//       ></i>
//       {suggestions.map((elem, idx) => (
//         <div
//           key={idx}
//           onClick={() => handleSuggestionClick(elem)}
//           className="flex gap-4 w-full border-2 p-3 bg-white border-slate-500 active:border-black rounded-xl items-center my-2 justify-between"
//         >
//           <div className="flex justify-end gap-3">
//             <h2 className="h-8 flex items-center justify-center w-12 rounded-full">
//               <img className="h-8 w-8" src="/icons/placeholder.png" alt="" />
//             </h2>
//             <h4 className="font-bold text-xl">{elem.name}</h4>
//           </div>
//           <div>
//             <h4 className="font-semibold text-sm">
//               {elem.portsAvailable} Ports Available
//             </h4>
//             <h4 className="font-semibold text-sm">
//               Distance - {elem.distance} KMs
//             </h4>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LocationSearchPanel;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LocationSearchPanel = ({ setPanelOpen, setSelect, userLocation, setMicOn }) => {
  const [suggestions, setSuggestions] = useState([]);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNearestLocations = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get("http://localhost:3000/maps/get-nearest-locations", {
          params: {
            origin: `${userLocation.latitude},${userLocation.longitude}`,
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (Array.isArray(data)) {
          setSuggestions(data);
          voiceOutResults(data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching nearest locations:", error);
      }
    };

    if (userLocation) {
      fetchNearestLocations();
    }

    const voiceOutResults = (stations) => {
      const synth = window.speechSynthesis;
      let utterance = new SpeechSynthesisUtterance(
        `Found ${stations.length} charging stations.`
      );
      synth.speak(utterance);

      stations.slice(0, 3).forEach((station, index) => {
        utterance = new SpeechSynthesisUtterance(
          `Station ${index + 1}: ${station.name}, ${
            station.portsAvailable
          } ports available.`
        );
        synth.speak(utterance);
      });

      utterance.onend = () => {
        setMicOn(true);
        startListeningForSelection(stations);
      };
    };

    const startListeningForSelection = (stations) => {
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.trim();
        console.log(`Voice command: ${transcript}`);

        const selectedStation = stations.find(station =>
          station.name.toLowerCase() === transcript.toLowerCase()
        );

        if (selectedStation) {
          handleSuggestionClick(selectedStation);
        } else {
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(
            `Station ${transcript} not found. Please try again.`
          );
          synth.speak(utterance);
          utterance.onend = () => {
            startListeningForSelection(stations);
          };
        }
      };

      recognition.onend = () => {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      };

      recognition.start();
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [userLocation]);

  const handleSuggestionClick = (suggestion) => {
    setSelect(suggestion);
    setPanelOpen(false);
    navigate(`/page?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&destinationLat=${suggestion.latitude}&destinationLng=${suggestion.longitude}`);
  };

  return (
    <div className="flex flex-col items-center overflow-y-auto h-full">
      <i
        onClick={() => {
          setPanelOpen(false);
        }}
        className="ri-arrow-down-wide-line items-center text-4xl font-bold invert "
      ></i>
      {suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(elem)}
          className="flex gap-4 w-full border-2 p-3 bg-white border-slate-500 active:border-black rounded-xl items-center my-2 justify-between"
        >
          <div className="flex justify-end gap-3">
            <h2 className="h-8 flex items-center justify-center w-12 rounded-full">
              <img className="h-8 w-8" src="/icons/placeholder.png" alt="" />
            </h2>
            <h4 className="font-bold text-xl">{elem.name}</h4>
          </div>
          <div>
            <h4 className="font-semibold text-sm">
              {elem.portsAvailable} Ports Available
            </h4>
            <h4 className="font-semibold text-sm">
              Distance - {elem.distance} KMs
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;