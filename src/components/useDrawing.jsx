import { useState, useRef, useEffect } from "react";

export const useDrawing = (initialShapes = [], initialColor = "#0ff", initialTool = "pen") => {
  const [shapes, setShapes] = useState(initialShapes);
  const [color, setColor] = useState(initialColor);
  const [tool, setTool] = useState(initialTool);

  const isDrawing = useRef(false);
  const history = useRef([[]]);
  const historyStep = useRef(0);

  // 描画開始
  const startDrawing = (pos) => {
    isDrawing.current = true;
    setShapes((prev) => [...prev, { points: [pos.x, pos.y], color, tool }]);
  };

  // 描画中
  const drawMove = (pos) => {
    if (!isDrawing.current) return;
    setShapes((prev) => {
      const lastIdx = prev.length - 1;
      const lastShape = prev[lastIdx];
      return [
        ...prev.slice(0, lastIdx),
        { ...lastShape, points: [...lastShape.points, pos.x, pos.y] },
      ];
    });
  };

  // 描画終了
  const endDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const newHistory = history.current.slice(0, historyStep.current + 1);
    newHistory.push([...shapes]);
    history.current = newHistory;
    historyStep.current = newHistory.length - 1;
    setShapes([...shapes]);
  };

  // 元に戻す・やり直し・クリア
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

  const clear = () => {
    setShapes([]);
    history.current = [[]];
    historyStep.current = 0;
  };

  // マウス・タッチ座標取得
  const getPointerPos = (e) => {
    const stage = e.target.getStage();
    return stage.getPointerPosition();
  };

  const handleDown = (e) => {
    const pos = getPointerPos(e);
    if (!pos) return;
    startDrawing(pos);
  };

  const handleMove = (e) => {
    const pos = getPointerPos(e);
    if (!pos) return;
    drawMove(pos);
  };


  // キャンバス外で描画終了
  useEffect(() => {
    const handleGlobalUp = () => (isDrawing.current = false);
    document.addEventListener("mouseup", handleGlobalUp);
    document.addEventListener("touchend", handleGlobalUp);
    return () => {
      document.removeEventListener("mouseup", handleGlobalUp);
      document.removeEventListener("touchend", handleGlobalUp);
    };
  }, []);

  return {
    shapes,
    setShapes,
    color,
    setColor,
    tool,
    setTool,
    startDrawing,
    drawMove,
    endDrawing,
    handleDown,
    handleMove,
    undo,
    redo,
    clear,
  };
};
