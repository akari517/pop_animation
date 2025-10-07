import React, { useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import "./FrameMotionScreen.css";
import image2 from "../../assets/image4.jpg";
import URLImage from "../../components/URLImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";
import { useDrawing } from "../../components/useDrawing";

function FrameMotionScreen() {
  const stageSize = useStageSize();
  const [tick, setTick] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState(null); // null, "wave", "pulse", "fade"

  const {
    handleDown,
    handleMove,
    endDrawing,
    undo,
    redo,
    clear
  } = useDrawing([], "#0ff", "pen");


  return (
    <div className="frame-container">

      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={endDrawing}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={endDrawing}
      >
        {/* 背景画像 */}
        <Layer>
          <URLImage src={image2} stageWidth={stageSize.width} stageHeight={stageSize.height} />
        </Layer>

      </Stage>
    </div>
  );
}

export default FrameMotionScreen;
