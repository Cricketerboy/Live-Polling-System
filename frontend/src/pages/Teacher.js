import React, { useState, useEffect } from "react";
import socket from "../socket";
import ChatPopup from "./ChatPopup";

const Teacher = () => {
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60); // Custom duration state
  const [currentPoll, setCurrentPoll] = useState(null);
  const [results, setResults] = useState({});
  const [pollActive, setPollActive] = useState(false);
  const [history, setHistory] = useState([]); // Poll history state

  useEffect(() => {
    socket.on("poll-results", (data) => {
      setResults(data);
    });

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

    const newPoll = {
      question: question.trim(),
      options: ["A", "B", "C", "D"],
      timestamp: Date.now(),
      duration: parseInt(duration),
    };

    socket.emit("new-poll", newPoll);
    setCurrentPoll(newPoll);
    setPollActive(true);
    setResults({});
    setQuestion("");
  };

  const fetchHistory = async () => {
    const res = await fetch("http://localhost:5000/api/poll-history");
    const data = await res.json();
    setHistory(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Teacher Dashboard</h2>

      <input
        type="text"
        placeholder="Enter poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={pollActive}
      />
      <br /><br />
      {/* ✅ Duration input */}
      <input
        type="number"
        placeholder="Poll duration (sec)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        disabled={pollActive}
      />
      <br /><br />
      <button onClick={handleCreatePoll} disabled={pollActive}>
        Ask Question
      </button>

      {currentPoll && (
        <div>
          <h3>Current Question: {currentPoll.question}</h3>
          <h4>Live Results:</h4>
          <ul>
            {["A", "B", "C", "D"].map((opt) => (
              <li key={opt}>
                {opt}: {results[opt] || 0} votes
              </li>
            ))}
          </ul>
        </div>
      )}

      <br />
      {/* ✅ History button and list */}
      <button onClick={fetchHistory}>View Past Polls</button>
      <ul>
        {history.map((poll, i) => (
          <li key={i}>
            <strong>{poll.question}</strong> -{" "}
            {new Date(poll.timestamp).toLocaleTimeString()}
            <ul>
              {Object.entries(poll.results).map(([opt, count]) => (
                <li key={opt}>
                  {opt}: {count}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      
      <ChatPopup name="Teacher" />
    </div>
  );
};

export default Teacher;
