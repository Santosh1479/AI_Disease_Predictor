import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserSocketContext } from "../context/UserSocketContext"; // Import SocketContext
import axios from "axios";
import { useContext } from "react";

const ChatPage = () => {
  const { roomId } = useParams(); // Get the room ID from the URL
  const navigate = useNavigate();
  const socket = useContext(UserSocketContext); // Use the socket from SocketContext
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  // Fetch chat room details
  useEffect(() => {
    const fetchChatRoomDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId =
          localStorage.getItem("userId") || localStorage.getItem("doctorId"); // Get the logged-in user's ID
        setSenderId(userId); // Set the senderId as the logged-in user's ID

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat/room/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const doctorId = response.data.senderId;
        const patientId = response.data.receiverId;
        if (doctorId === userId) {
          setReceiverId(patientId);
        } else {
          setReceiverId(doctorId);
        }
      } catch (error) {
        console.error("Error fetching chat room details:", error);
      }
    };

    fetchChatRoomDetails();
  }, [roomId]);

  // Fetch messages and listen for new messages
  useEffect(() => {
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/messages/${roomId}`
      );
      setMessages(response.data); // Save all messages to state
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  fetchMessages();

  // Only add listeners if socket exists
  if (!socket) return;

  // Listen for new messages from the socket
  socket.on("receive_message", (data) => {
    if (data.roomId === roomId) {
      setMessages((prevMessages) => [...prevMessages, data]);
    }
  });

  return () => {
    // Clear notifications when exiting the chatroom
    const clearNotifications = async () => {
      try {
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/chat/clear-notifications/${roomId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        console.error("Error clearing notifications on exit:", error);
      }
    };

    clearNotifications();
    if (socket) {
      socket.off("receive_message");
    }
  };
}, [roomId, socket]);

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      roomId,
      senderId, // Use senderId from state
      receiverId, // Use receiverId from state
      message: newMessage,
      timestamp: new Date().toISOString(), // Use ISO format for timestamps
    };

    try {
      // Emit the message to the socket server
      socket.emit("send_message", messageData);

      // Save the message to the backend
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/messages`,
        messageData
      );

      // Update the local state
      setMessages((prevMessages) => [...prevMessages, messageData]);

      // Clear the input field
      setNewMessage("");
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center bg-blue-500 text-white p-4 shadow-md">
        <h1 className="text-lg font-bold">Chat Room</h1>
        <button
          className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate("/doctor-home")}
        >
          Back
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.senderId === senderId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.senderId === senderId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p>{msg.message}</p>
              <small className="block text-xs mt-1">
                {msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString()
                  : "Unknown time"}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center p-4 bg-white border-t border-gray-300">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-lg p-2 mr-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { SocketContext } from "../context/SocketContext"; // Import SocketContext
// import axios from "axios";
// import { useContext } from "react";

// const ChatPage = () => {
//   const { roomId } = useParams(); // Get the room ID from the URL
//   const { socket } = useContext(SocketContext); // Use the socket from SocketContext
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [senderId, setSenderId] = useState(null);
//   const [receiverId, setReceiverId] = useState(null);

//   useEffect(() => {
//     const fetchChatRoomDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const userId =
//           localStorage.getItem("userId") || localStorage.getItem("doctorId"); // Get the logged-in user's ID
//         setSenderId(userId); // Set the senderId as the logged-in user's ID
//         console.log("Logged-in user ID (senderId):", userId);

//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}/chat/room/${roomId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const doctorId = response.data.senderId;
//         const patientId = response.data.receiverId;
//         if(doctorId === userId) {
//           setReceiverId(patientId);
//         } else {
//           setReceiverId(doctorId);
//         }

//         // Determine the receiverId based on the logged-in user's role
//         const receiver = userId === doctorId ? patientId : doctorId;
//         setReceiverId(receiver);
//         console.log("Receiver ID:", receiver);
//       } catch (error) {
//         console.error("Error fetching chat room details:", error);
//       }
//     };

//     fetchChatRoomDetails();
//   }, [roomId]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}/messages/${roomId}`
//         );
//         setMessages(response.data);
//         console.log("Fetched messages:", response.data); //
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();

//     // Listen for new messages from the socket
//     socket.on("receive_message", (data) => {
//       if (data.roomId === roomId) {
//         setMessages((prevMessages) => [...prevMessages, data]);
//       }
//     });

//     return () => {
//       socket.off("receive_message");
//     };
//   }, [roomId, socket]);

//   const sendMessage = async () => {
//     if (newMessage.trim() === "") return;

//     const messageData = {
//       roomId,
//       senderId, // Use senderId from state
//       receiverId, // Use receiverId from state
//       message: newMessage,
//       time: new Date().toISOString(), // Use ISO format for timestamps
//     };

//     console.log("Sending message:", messageData); // Debugging payload

//     try {
//       // Emit the message to the socket server
//       socket.emit("send_message", messageData);

//       // Save the message to the backend
//       await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/messages`,
//         messageData
//       );

//       // Update the local state
//       setMessages((prevMessages) => [...prevMessages, messageData]);

//       // Clear the input field
//       setNewMessage("");
//     } catch (error) {
//       console.error(
//         "Error sending message:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header */}
//       <div className="flex items-center bg-blue-500 text-white p-4 shadow-md">
//         <h1 className="text-lg font-bold">Chat Room</h1>
//       </div>

//       {/* Messages */}
//       <div className="flex-grow overflow-y-auto p-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`mb-4 flex ${
//               msg.senderId._id === senderId ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xs p-3 rounded-lg ${
//                 msg.senderId._id === senderId
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-black"
//               }`}
//             >
//               <p>{msg.message}</p>
//               <small className="block text-xs mt-1">{msg.time}</small>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input Box */}
//       <div className="flex items-center p-4 bg-white border-t border-gray-300">
//         <input
//           type="text"
//           className="flex-grow border border-gray-300 rounded-lg p-2 mr-2"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
