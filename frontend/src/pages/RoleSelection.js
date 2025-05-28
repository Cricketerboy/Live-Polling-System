import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoleSelection.css";

const RoleSelection = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (role === "student") navigate("/student");
    else if (role === "teacher") navigate("/teacher");
  };

  return (
    <div className="role-container">
      <div className="badge">✧ Intervue Poll</div>
      <h1>Welcome to the <strong>Live Polling System</strong></h1>
      <p ><strong>Please select the role that best describes you to begin using the live polling system</strong></p>

      <div className="roles">
        <div
          className={`role-card ${role === "student" ? "selected" : ""}`}
          onClick={() => setRole("student")}
        >
          <h3>I’m a Student</h3>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
        </div>

        <div
          className={`role-card ${role === "teacher" ? "selected" : ""}`}
          onClick={() => setRole("teacher")}
        >
          <h3>I’m a Teacher</h3>
          <p>Submit answers and view live poll results in real-time.</p>
        </div>
      </div>

      <button
        className="continue-btn"
        onClick={handleContinue}
        disabled={!role}
      >
        Continue
      </button>
    </div>
  );
};

export default RoleSelection;
