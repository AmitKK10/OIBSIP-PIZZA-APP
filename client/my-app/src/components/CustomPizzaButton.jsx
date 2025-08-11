import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPizzaSlice } from "react-icons/fa";
import "./CustomPizzaButton.css";

const CustomPizzaButton = () => {
  const navigate = useNavigate();
  return (
    <button className="nav-btn" onClick={() => navigate("/custom-pizza")}>
      <FaPizzaSlice className="icon" />
    </button>
  );
};

export default CustomPizzaButton;
