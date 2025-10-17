import React, { createContext, useState } from "react";

export const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [shapesHistory, setShapesHistory] = useState([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [stamps, setStamps] = useState([]);
  const [color, setColor] = useState("#ffb6c1");
  const [tool, setTool] = useState("pen");
  const [activeEffect, setActiveEffect] = useState("none");
  const [activeFrame, setActiveFrame] = useState("none");
  const [simpleFrameColor, setSimpleFrameColor] = useState("#000000");
  const [workId, setWorkId] = useState(null);

  const setSelectedImageFromFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const currentShapes = shapesHistory[historyStep] || [];

  const pushShapeHistory = (newShapes) => {
    const newHistory = shapesHistory.slice(0, historyStep + 1);
    newHistory.push([...newShapes]);
    setShapesHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep === 0) return;
    setHistoryStep(historyStep - 1);
  };

  const redo = () => {
    if (historyStep >= shapesHistory.length - 1) return;
    setHistoryStep(historyStep + 1);
  };

  const clear = () => {
    setShapesHistory([[]]);
    setHistoryStep(0);
    setStamps([]);
  };

  return (
    <AnimationContext.Provider
      value={{
        selectedImage,
        setSelectedImageFromFile,
        currentShapes,
        pushShapeHistory,
        undo,
        redo,
        clear,
        stamps,
        setStamps,
        color,
        setColor,
        tool,
        setTool,
        activeEffect,
        setActiveEffect,
        activeFrame,
        setActiveFrame,
        simpleFrameColor,
        setSimpleFrameColor,
        workId,
        setWorkId,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
