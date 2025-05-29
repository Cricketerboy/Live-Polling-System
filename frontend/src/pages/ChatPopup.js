// ChatPopup.jsx
import React, { useState } from "react";
import socket from "../socket";
import "../styles/Teacher.css";

const ChatPopup = ({ name, messages = [], setMessages }) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [msg, setMsg] = useState("");

  const participants = [
    "Rahul Arora",
    "Pushpender Rautela",
    "Rijul Zalpuri",
    "Nadeem N",
    "Ashwin Sharma",
  ];

  const sendMessage = () => {
    if (!msg.trim()) return;

    const messageData = {
      sender: name,
      message: msg.trim(),
    };
    console.log("Sending message:", messageData);
    socket.emit("send-message", messageData);

    // if (typeof setMessages === "function") {
    //   setMessages((prev) => [...prev, messageData]);
    // } else {
    //   console.error("setMessages is not a function!", setMessages);
    // }

    setMsg("");
  };

  return (
    <div className="chat-popup-container">
      <div className="chat-header">
        <div
          className={`chat-tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </div>
        <div
          className={`chat-tab ${activeTab === "participants" ? "active" : ""}`}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </div>
      </div>

      <div className="chat-body">
        {activeTab === "chat" ? (
          <>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`message-row ${m.sender === name ? "right" : "left"}`}
                >
                  <div className="message-bubble">{m.message}</div>
                  <div className="sender-label">{m.sender}</div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="participants-list">
            {participants.map((p, i) => (
              <div className="participant-row" key={i}>
                <span>{p}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPopup;
