import React, { useState, useEffect } from "react";
import socket from "../socket";
import { v4 as uuidv4 } from "uuid";
import ChatPopup from "./ChatPopup";
import { FaRegCommentAlt } from "react-icons/fa"
import "../styles/EnterName.css";

const Student = () => {
  const [studentId] = useState(() => {
    return sessionStorage.getItem("studentId") || uuidv4();
  });

  const [name, setName] = useState(() => sessionStorage.getItem("name") || "");
  const [inputName, setInputName] = useState("");

  const [currentPoll, setCurrentPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("studentId", studentId);
  }, [studentId]);

  useEffect(() => {
    socket.on("poll-started", (poll) => {
      setCurrentPoll(poll);
      setSubmitted(false);
      setSelectedOption("");
      setResults({});
      setTimeLeft(poll.duration || 60);
    });

    socket.on("poll-results", (data) => {
      setResults(data);
    });

    socket.on("poll-ended", () => {
      setTimeLeft(0);
    });

    return () => {
      socket.off("poll-started");
      socket.off("poll-results");
      socket.off("poll-ended");
    };
  }, []);

  useEffect(() => {
    if (!currentPoll || submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPoll, submitted, timeLeft]);

  const handleSubmit = () => {
    if (!selectedOption) return;

    socket.emit("submit-answer", {
      studentId,
      option: selectedOption,
    });
    setSubmitted(true);
  };

  const handleNameSubmit = () => {
    if (!inputName.trim()) return;
    setName(inputName.trim());
    sessionStorage.setItem("name", inputName.trim());
  };

  if (!name) {
    return (
      <div className="enter-name-container">
        <div className="enter-name-badge">✧ Intervue Poll</div>

        <h1 className="enter-name-title">
          Let’s <strong>Get Started</strong>
        </h1>

        <p className="enter-name-description">
          If you’re a student, you’ll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
        </p>

        <div className="enter-name-form">
          <label htmlFor="name" className="enter-name-label">
            Enter your Name
          </label>
          <input
            id="name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="enter-name-input"
            placeholder="Your name"
          />
        </div>

        <button
          onClick={handleNameSubmit}
          disabled={!inputName.trim()}
          className="enter-name-button"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {currentPoll ? (
        <>
          <h3>{currentPoll.question}</h3>
          <p>Time left: {timeLeft} seconds</p>

          {!submitted && timeLeft > 0 ? (
            <>
              {currentPoll.options.map((opt) => (
                <div key={opt}>
                  <label>
                    <input
                      type="radio"
                      name="poll"
                      value={opt}
                      checked={selectedOption === opt}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    {opt}
                  </label>
                </div>
              ))}
              <button onClick={handleSubmit} disabled={!selectedOption}>
                Submit
              </button>
            </>
          ) : (
            <>
              <h4>Live Results:</h4>
              <ul>
                {currentPoll.options.map((opt) => (
                  <li key={opt}>
                    {opt}: {results[opt] || 0} votes{" "}
                    {opt === currentPoll.correctAnswer && "✅"}
                  </li>
                ))}
              </ul>

              {submitted && (
                <p>
                  You selected: <strong>{selectedOption}</strong> —{" "}
                  {selectedOption === currentPoll.correctAnswer ? (
                    <span style={{ color: "green" }}>Correct ✅</span>
                  ) : (
                    <span style={{ color: "red" }}>Incorrect ❌</span>
                  )}
                </p>
              )}
            </>
          )}
        </>
      ) : (
        <div className="poll-waiting-container">
          <div className="poll-badge">✧ Intervue Poll</div>
          <div className="loader"></div>
          <p className="poll-waiting-text">Wait for the teacher to ask questions..</p>
        </div>
      )}

      {/* Chat toggle button */}
      <div className="chat-toggle-container">
        <button className="chat-toggle-button" onClick={() => setShowChat(!showChat)}>
          <FaRegCommentAlt size={20} />
        </button>
        {showChat && <ChatPopup name={name} />}
      </div>
    </div>
  );
};

export default Student;
