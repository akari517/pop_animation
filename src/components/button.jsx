import React from "react";
import "./button.css";

const Button = ({ children, onClick, isActiv, style, type = "default" }) => {
  return (
    <button
    className={'custom-button ${type}${isActiv ? "active" : ""}'}
    
    onClick={onClick}
      tyle={style}
    >
    {children}
    </button> 
  );
};
export default Button;
