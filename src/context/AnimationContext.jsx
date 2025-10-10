// src/context/AnimationContext.jsx
import React, { createContext, useState, useRef } from "react";

export const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null); // 選択画像
  const [shapes, setShapes] = useState([]); // Sketch / Stamp 用描画
  const [activeEffect, setActiveEffect] = useState("none");
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#ffb6c1");
  const history = useRef([[]]);
  const historyStep = useRef(0);

  const [activeFrame, setActiveFrame] = useState("none");
  const [simpleFrameColor, setSimpleFrameColor] = useState("#ff0000");

  const [activeAnimation, setActiveAnimation] = useState(null); // FrameMotion 用

  // 描画追加（Sketch / Stamp）
  const addShape = (newShape) => {
    setShapes(prev => [...prev, newShape]);
    const newHistory = history.current.slice(0, historyStep.current + 1);
    newHistory.push([...shapes, newShape]);
    history.current = newHistory;
    historyStep.current = newHistory.length - 1;
  };

  const undo = () => {
    if (historyStep.current === 0) return;
    historyStep.current -= 1;
    setShapes(history.current[historyStep.current]);
  };

  const redo = () => {
    if (historyStep.current === history.current.length - 1) return;
    historyStep.current += 1;
    setShapes(history.current[historyStep.current]);
  };

  const clearAll = () => {
    setShapes([]);
    history.current = [[]];
    historyStep.current = 0;
  };

  // selectedImage を File からセットするときは古い blob URL を revoke してメモリを解放
  const setSelectedImageFromFile = (file) => {
    if (!file) return;
    if (selectedImage && typeof selectedImage === "string" && selectedImage.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(selectedImage);
      } catch (e) {
        // ignore
      }
    }
    setSelectedImage(URL.createObjectURL(file));
  };

  return (
    <AnimationContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        setSelectedImageFromFile,
        shapes,
        setShapes,
        addShape,
        activeEffect,
        setActiveEffect,
        tool,
        setTool,
        color,
        setColor,
        undo,
        redo,
        clearAll,
        activeFrame,
        setActiveFrame,
        simpleFrameColor,
        setSimpleFrameColor,
        activeAnimation,
        setActiveAnimation
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
