import React, { useState, useEffect } from 'react';
import socket from '../socket';

const ChatPopup = ({ name }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;

    socket.emit("send-message", {
      sender: name,
      message: msg.trim()
    });

    setMsg("");
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#fff', border: '1px solid #ccc', padding: 10, width: 300 }}>
      <h4>Chat</h4>
      <div style={{ height: 150, overflowY: 'auto', border: '1px solid #eee', marginBottom: 8, padding: 5 }}>
        {messages.map((m, idx) => (
          <div key={idx}><strong>{m.sender}:</strong> {m.message}</div>
        ))}
      </div>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type..." style={{ width: '80%' }} />
      <button onClick={sendMessage} style={{ width: '18%' }}>Send</button>
    </div>
  );
};

export default ChatPopup;
