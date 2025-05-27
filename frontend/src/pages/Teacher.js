import React, { useState, useEffect } from "react";
import socket from "../socket";

const Teacher = () => {
  const [question, setQuestion] = useState("");
  const [currentPoll, setCurrentPoll] = useState(null);
  const [results, setResults] = useState({});
  const [pollActive, setPollActive] = useState(false);

  // Handle incoming poll results
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
      options: ["A", "B", "C", "D"], // Fixed options for now
      timestamp: Date.now(),
      duration: 60, // default 60 seconds
    };

    socket.emit("new-poll", newPoll);
    setCurrentPoll(newPoll);
    setPollActive(true);
    setResults({});
    setQuestion("");
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
    </div>
  );
};

export default Teacher;
