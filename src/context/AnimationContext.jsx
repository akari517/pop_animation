// src/context/AnimationContext.js
import React, { createContext, useState } from "react";

export const AnimationContext = createContext();

export const AnimationProvider = ({ children, initialImage = null }) => {
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [shapes, setShapes] = useState([]);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#ffb6c1");
  const [activeEffect, setActiveEffect] = useState("none");

  const setSelectedImageFromFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <AnimationContext.Provider
      value={{
        selectedImage,
        setSelectedImageFromFile,
        shapes,
        setShapes,
        tool,
        setTool,
        color,
        setColor,
        activeEffect,
        setActiveEffect,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
