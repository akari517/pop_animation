import React from "react";
import "./button.css";

const Button = ({ children, onClick, isActiv, style, type = "default" }) => {
  return (
    <button
      className={`custom-button ${type} ${isActiv ? "active" : ""}`} // ← isActivの判定を確実に
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
