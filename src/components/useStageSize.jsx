import { useState, useEffect } from "react";

// ステージのサイズをウィンドウサイズに応じて動的に変更するカスタムフック(KonbaのStage用)
export const useStageSize = (bottomBarHeight = 70, topOffset = 0) => {
  // bottomBarHeight: 固定のボトムバー高さ（px）。AnimationMenu では70を使用。
  // topOffset: 上部ヘッダー等があれば px で指定。
  const compute = () => ({
    width: window.innerWidth,
    height: Math.max(100, window.innerHeight - bottomBarHeight - topOffset),
  });

  const [stageSize, setStageSize] = useState(compute());

  useEffect(() => {
    const handleResize = () => setStageSize(compute());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [bottomBarHeight, topOffset]);

  return stageSize;
};

