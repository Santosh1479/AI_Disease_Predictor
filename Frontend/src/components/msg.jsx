import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = ({ room }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [author, setAuthor] = useState('User'); // Change as needed

  useEffect(() => {
    socket.emit('join_room', room);

    socket.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const time = new Date().toLocaleTimeString();
      const newMessage = { author, message, time, room };
      socket.emit('send_message', newMessage);
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