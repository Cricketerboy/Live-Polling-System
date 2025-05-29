import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Teacher.css";
import ChatPopup from "./ChatPopup";
import { FaRegCommentAlt,  FaEye } from "react-icons/fa";


const PollResultsScreen = ({ currentPoll, results, onAskNewQuestion, allAnswered}) => {
    const [showChat, setShowChat] = useState(false);
    const navigate = useNavigate();

  if (!currentPoll) return null;

  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);

  const handleViewHistory = () => {
    navigate("/poll-history");
  };

  return (
    <div style={{ padding: 20 }}>
        {/* View Poll History Button */}
        <div className="view-history-button" onClick={handleViewHistory}>
        <FaEye size={12} />
        View Poll History
      </div>

      <div className="poll-container">
        <div className="poll-question-header">
          <h3>Question</h3>
        </div>

        <div className="poll-question-box">
          <h4>{currentPoll.question}</h4>

          <div className="poll-results">
            {currentPoll.options.map((opt, index) => {
              const votes = results[opt] || 0;
              const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

              return (
                <div key={opt} className="poll-result-bar">
                  <div
                    className="poll-result-fill"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className={`option-label ${percentage >= 50 ? 'white-text' : 'black-text'}`}>
                      <span className={`option-circle ${currentPoll.correctAnswer === opt ? 'selected-circle' : ''}`}>
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
          <button
            onClick={onAskNewQuestion}
            disabled={!allAnswered}
            className="ask-new-question-button"
            title={allAnswered ? "Ask New Question" : "Poll is not exit yet"}
          >
            <span style={{fontSize: "14px",fontWeight: "bold"}}>+</span> Ask a new question
          </button>
        </div>
      </div>
      {/* Chat toggle button */}
    <div className="chat-toggle-container">
      <button className="chat-toggle-button" onClick={() => setShowChat(!showChat)}>
        <FaRegCommentAlt size={20} />
      </button>
      {showChat && <ChatPopup name={"Teacher"} />}
    </div>
    </div>
  );
};

export default PollResultsScreen;
