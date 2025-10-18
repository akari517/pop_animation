// src/context/AnimationContext.jsx
import React, { createContext, useState, useEffect } from "react";
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
  const [workIdState, setWorkIdState] = useState(null);

  const currentShapes = shapesHistory[historyStep] || [];

  // ----------------- workId管理 -----------------
  const setWorkId = (id) => {
    setWorkIdState(id);
    if (id) localStorage.setItem("workId", String(id));
    else localStorage.removeItem("workId");
  };

  // ----------------- 履歴管理 -----------------
  const pushShapeHistory = (newShapes) => {
    const newHistory = shapesHistory.slice(0, historyStep + 1);
    newHistory.push([...newShapes]);
    setShapesHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => setHistoryStep((s) => Math.max(s - 1, 0));
  const redo = () => setHistoryStep((s) => Math.min(s + 1, shapesHistory.length - 1));
  const clear = () => {
    setShapesHistory([[]]);
    setHistoryStep(0);
    setStamps([]);
    setSelectedImage(null);
  };

  // ----------------- 保存 -----------------
  const saveAnimation = async () => {
    if (!workIdState) {
      // 新規作成
      const { data, error } = await supabase
        .from("animations")
        .insert([{
          animation_data: { shapes: currentShapes, stamps, selectedImage },
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();
      if (error) {
        console.error("保存失敗:", error);
        alert("保存に失敗しました");
        return;
      }
      setWorkId(data.work_id);
      alert("保存しました！（新規作成）");
      return;
    }

    // 追記・上書き
    const { error } = await supabase
      .from("animations")
      .insert([{
        work_id: workIdState,
        animation_data: { shapes: currentShapes, stamps, selectedImage },
        created_at: new Date().toISOString(),
      }]);
    if (error) {
      console.error("保存失敗:", error);
      alert("保存に失敗しました");
    } else {
      alert("保存しました！（更新）");
    }
  };

  // ----------------- ロード -----------------
  const loadAnimation = async (id) => {
    if (!id) return;

    const { data, error } = await supabase
      .from("animations")
      .select("animation_data")
      .eq("work_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("ロード失敗:", error);
      return;
    }

    if (!data) {
      console.log("該当するアニメーションはまだ存在しません");
      return;
    }

    const loaded = data.animation_data || {};
    setShapesHistory([[...(loaded.shapes || [])]]);
    setHistoryStep(0);
    setStamps(loaded.stamps || []);
    setSelectedImage(loaded.selectedImage || null);
  };

  // ----------------- リセット -----------------
  const resetAnimation = () => {
    setShapesHistory([[]]);
    setHistoryStep(0);
    setStamps([]);
    setSelectedImage(null);
    setColor("#ffb6c1");
    setTool("pen");
    setActiveEffect("none");
    setActiveFrame("none");
    setSimpleFrameColor("#000000");
    setWorkIdState(null);
    localStorage.removeItem("workId");
  };

  // 起動時に localStorage から workId を読み込み
  useEffect(() => {
    const stored = localStorage.getItem("workId");
    if (stored) {
      setWorkId(stored);
      loadAnimation(stored); // ← ここで selectedImage も復元される
    }
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        selectedImage,
        setSelectedImageFromFile: (file) => {
          const reader = new FileReader();
          reader.onload = () => setSelectedImage(reader.result);
          reader.readAsDataURL(file);
        },
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
        workId: workIdState,
        setWorkId,
        saveAnimation,
        loadAnimation,
        resetAnimation,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
