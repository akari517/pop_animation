import { useState, useEffect } from "react";

// ステージのサイズをウィンドウサイズに応じて動的に変更するカスタムフック(KonbaのStage用)
export const useStageSize = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.8 - 50 - 50 - 16,
  });

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight * 0.8 - 50 - 50 - 16,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return stageSize;
};

