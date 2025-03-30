import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const Chat = () => {
  const location = useLocation();
  const { roomId, userId, doctorId } = location.state;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [author, setAuthor] = useState(userId); // Set author to userId

  const socket = io(`${import.meta.env.SOCKET}`);

  useEffect(() => {
    socket.emit('join_room', roomId);

    socket.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const time = new Date().toLocaleTimeString();
      const newMessage = { author, message, time, room: roomId };
      socket.emit('send_message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the message to the local state
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.author === author ? 'own' : ''}`}>
            <strong>{msg.author}</strong>: {msg.message} <em>{msg.time}</em>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;