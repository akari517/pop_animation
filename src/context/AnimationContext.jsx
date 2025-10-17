import React, { createContext, useState } from "react";
import { supabase } from "../supabaseClient";

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

  const saveAnimation = async (userId = null) => {
    try {
      const currentShapes = shapesHistory[historyStep];
      // if (!currentShapes || currentShapes.length === 0) {
      //   throw new Error('保存するアニメーションデータがありません');
      // }

      if (!workId) {
        throw new Error('作品IDが必要です');
      }

      const animationData = {
        work_id: workId,
        user_id: userId,
        animation_data: currentShapes.map(shape => ({
          points: shape.points,
          animation: shape.animation,
          width: shape.width,
          height: shape.height,
          minX: shape.minX,
          minY: shape.minY,
          color: shape.color,
          tool: shape.tool
        }))
      };

      const { data, error } = await supabase
        .from('animations')
        .upsert([animationData], {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('アニメーション保存エラー:', error);
      throw error;
    }
  };

  const loadAnimationFromDb = async (workId) => {
    try {
      const { data, error } = await supabase
        .from('animations')
        .select('animation_data')
        .eq('work_id', workId)
        .single();

      if (error) throw error;
      return data?.animation_data || [];
    } catch (error) {
      console.error('アニメーション読み込みエラー:', error);
      throw error;
    }
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
        saveAnimation,
        loadAnimationFromDb,
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
