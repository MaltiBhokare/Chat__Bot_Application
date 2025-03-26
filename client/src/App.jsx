

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, { ...data, time: new Date().toLocaleTimeString() }]);
    });
    return () => socket.off('receive_message');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === '') return;
    const newMsg = { text: message, sender: 'User', time: new Date().toLocaleTimeString() };
    socket.emit('send_message', newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setMessage('');
  };

  const avatar = (sender) =>
    sender === 'User'
      ? 'https://cdn-icons-png.flaticon.com/512/9131/9131529.png'
      : 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png';

  const messageStyle = (sender) => ({
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: '16px',
    backgroundColor: sender === 'User' ? (darkMode ? '#4caf50' : '#dcf8c6') : (darkMode ? '#555' : '#e0e0e0'),
    color: darkMode ? '#fff' : '#000',
    alignSelf: sender === 'User' ? 'flex-end' : 'flex-start',
    whiteSpace: 'pre-wrap',
    animation: 'fadeIn 0.3s ease-in',
  });

  const wrapperStyle = (sender) => ({
    display: 'flex',
    flexDirection: sender === 'User' ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    gap: '10px',
    marginBottom: '10px',
  });

  return (
    <div style={{
      padding: '24px',
      maxWidth: '600px',
      margin: 'auto',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: darkMode ? '#1e1e1e' : '#fff',
      color: darkMode ? '#fff' : '#000'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>
        💬 Real-Time Chatbot
      </h1>

      <div style={{
        flex: 1,
        border: `1px solid ${darkMode ? '#444' : '#ccc'}`,
        borderRadius: '12px',
        padding: '12px',
        overflowY: 'auto',
        backgroundColor: darkMode ? '#2e2e2e' : '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={wrapperStyle(msg.sender)}>
            <img src={avatar(msg.sender)} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
            <div style={messageStyle(msg.sender)}>
              <strong>{msg.sender}:</strong><br />
              {msg.text}
              <div style={{ fontSize: '10px', textAlign: 'right', color: '#ccc' }}>{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <input
          style={{
            border: `1px solid ${darkMode ? '#666' : '#ccc'}`,
            padding: '12px',
            flex: 1,
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: darkMode ? '#444' : '#fff',
            color: darkMode ? '#fff' : '#000'
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          marginTop: '10px',
          alignSelf: 'center',
          backgroundColor: 'transparent',
          border: `1px solid ${darkMode ? '#888' : '#333'}`,
          color: darkMode ? '#ccc' : '#333',
          padding: '6px 14px',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
