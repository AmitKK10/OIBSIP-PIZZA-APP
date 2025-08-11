import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "./HomeButton.css";

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <button className="nav-btn" onClick={() => navigate("/home")}>
      <FaHome className="icon" />
    </button>
  );
};

export default HomeButton;
