import React, { useState, useEffect } from "react";
import socket from "../socket";
import ChatPopup from "./ChatPopup";
import "../styles/Teacher.css"; 

const Teacher = () => {
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [currentPoll, setCurrentPoll] = useState(null);
  const [results, setResults] = useState({});
  const [pollActive, setPollActive] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on("poll-results", (data) => setResults(data));
    socket.on("poll-ended", () => {
      setPollActive(false);
      setCurrentPoll(null);
    });

    return () => {
      socket.off("poll-results");
      socket.off("poll-ended");
    };
  }, []);

  const handleCreatePoll = () => {
    if (pollActive || !question.trim()) return;

    const filteredOptions = options.filter((opt) => opt.trim() !== "");
    if (filteredOptions.length < 2) {
      alert("Enter at least 2 options.");
      return;
    }
    if (!correctAnswer) {
      alert("Please select a correct answer.");
      return;
    }

    const newPoll = {
      question: question.trim(),
      options: filteredOptions,
      correctAnswer,
      timestamp: Date.now(),
      duration: parseInt(duration),
    };

    socket.emit("new-poll", newPoll);
    setCurrentPoll(newPoll);
    setPollActive(true);
    setResults({});
    setQuestion("");
    setOptions(["", ""]);
    setCorrectAnswer("");
  };

  const fetchHistory = async () => {
    const res = await fetch("https://live-polling-system-h2kx.onrender.com/api/poll-history");
    const data = await res.json();
    setHistory(data);
  };

 // Only showing updated return part
return (
  <div className="teacher-container">
    <span className="tag">✧ Intervue Poll</span>
    <h1 className="title">Let’s <strong>Get Started</strong></h1>
    <p className="subtitle">
      you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
    </p>

    <div className="section">
  <div className="top-row">
    <label className="label">Enter your question</label>
    <select
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      disabled={pollActive}
      className="duration-select"
    >
      {[30, 60, 90].map((d) => (
        <option key={d} value={d}>{d} seconds</option>
      ))}
    </select>
  </div>
  <textarea
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Type your question..."
    maxLength={100}
    disabled={pollActive}
    className="question-input"
  />
</div>


    <div className="section">
      <label className="label">Edit Options</label>
      {options.map((opt, index) => (
        <div className="option-row" key={index}>
          <span className="option-number">{index + 1}</span>
          <input
            type="text"
            value={opt}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`Option ${index + 1}`}
            disabled={pollActive}
            className="option-input"
          />
          <div className="radio-group">
            <label><input type="radio" name="correct" value={opt} checked={correctAnswer === opt} onChange={() => setCorrectAnswer(opt)} disabled={pollActive} /> Yes</label>
            <label><input type="radio" name="correct" value={opt} checked={correctAnswer !== opt && correctAnswer === ""} onChange={() => setCorrectAnswer("")} disabled={pollActive} /> No</label>
          </div>
        </div>
      ))}
      <button onClick={() => setOptions([...options, ""])} className="add-option" disabled={pollActive}>
        + Add More option
      </button>
    </div>

    <div className="button-row">
      <button onClick={handleCreatePoll} disabled={pollActive} className="ask-button">
        Ask Question
      </button>
    </div>

    {currentPoll && (
      <div className="results-card">
        <h3>Current Question: {currentPoll.question}</h3>
        <h4>Live Results:</h4>
        <ul>
          {currentPoll.options.map((opt) => (
            <li key={opt}>
              {opt}: {results[opt] || 0} votes{" "}
              {currentPoll.correctAnswer === opt && "✅"}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* <div className="history-section">
      <button onClick={fetchHistory} className="history-button">View Past Polls</button>
      <ul>
        {history.map((poll, i) => (
          <li key={i}>
            <strong>{poll.question}</strong> - {new Date(poll.timestamp).toLocaleTimeString()}
            <ul>
              {Object.entries(poll.results).map(([opt, count]) => (
                <li key={opt}>
                  {opt}: {count} {poll.correctAnswer === opt && "✅"}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div> */}

    {/* <ChatPopup name="Teacher" /> */}
  </div>
);

};

export default Teacher;
