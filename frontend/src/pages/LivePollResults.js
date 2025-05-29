// components/LivePollResults.js
import React from "react";
import "../styles/LivePollResults.css"; // Create or reuse styling

const LivePollResults = ({ currentPoll, results }) => {
  return (
    <div style={{ padding: 20 }}>
      <div className="poll-container">
        <div className="poll-question-header">
          <h3>Current Question</h3>
          <span className="timer">⏱️ Live</span>
        </div>

        <div className="poll-question-box">
          <h4>{currentPoll.question}</h4>

          <div className="poll-results">
            {currentPoll.options.map((opt, index) => {
              const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
              const votes = results[opt] || 0;
              const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

              return (
                <div key={opt} className="poll-result-bar">
                  <div
                    className="poll-result-fill"
                    style={{ width: `${percentage}%` }}
                  >
                    <span
                      className={`option-label ${percentage >= 50 ? 'white-text' : 'black-text'}`}
                    >
                      <span
                        className={`option-circle ${
                          currentPoll.correctAnswer === opt ? 'selected-circle' : ''
                        }`}
                      >
                        {index + 1}
                      </span>
                      {opt}
                    </span>
                  </div>
                  <span className="percentage-static">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="wait-message-container">
          Waiting for students to finish answering...
        </div>
      </div>
    </div>
  );
};

export default LivePollResults;
