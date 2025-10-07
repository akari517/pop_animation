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
    shapes,
    color,
    setColor,
    tool,
    setTool,
    handleDown,
    handleMove,
    endDrawing,
    undo,
    redo,
    clear
  } = useDrawing([], "#0ff", "pen");

  // tickを更新してアニメーション制御
  useEffect(() => {
    if (!activeAnimation) return;
    let animationId;
    const animate = () => {
      setTick(t => t + 1);
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [activeAnimation]);

  // 各アニメーションで位置やスケール・透明度を変える関数
  const getAnimationProps = (idx) => {
    switch (activeAnimation) {
      case "wave":
        return {
          x: Math.sin(tick / (20 + idx * 5)) * (5 + idx),
          y: Math.cos(tick / (25 + idx * 5)) * (5 + idx),
          scaleX: 1,
          scaleY: 1,
          opacity: 1
        };
      case "pulse":
        const s = 1 + Math.sin(tick / (15 + idx * 5)) * 0.1;
        return { x: 0, y: 0, scaleX: s, scaleY: s, opacity: 1 };
      case "fade":
        const o = 0.6 + Math.sin(tick / (30 + idx * 5)) * 0.4;
        return { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: o };
      default:
        return { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 };
    }
  };

  return (
    <div className="frame-container">
      {/* アニメーション切り替えボタン */}
      <div className="anim-btns">
        <button
          onClick={() => setActiveAnimation(activeAnimation === "wave" ? null : "wave")}
        >
          揺れる
        </button>
        <button
          onClick={() => setActiveAnimation(activeAnimation === "pulse" ? null : "pulse")}
        >
          ふわふわ
        </button>
        <button
          onClick={() => setActiveAnimation(activeAnimation === "fade" ? null : "fade")}
        >
          透明度
        </button>
      </div>

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

        {/* ペンで描いた線 */}
        <Layer>
          {shapes.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={6}
              lineCap="round"
              lineJoin="round"
              tension={0.5}
            />
          ))}
        </Layer>

        {/* 各線範囲のアニメーション */}
        {shapes.map((line, idx) => (
          <Layer
            key={idx}
            clipFunc={(ctx) => {
              if (line.points.length < 2) return;
              ctx.beginPath();
              const [x0, y0, ...rest] = line.points;
              ctx.moveTo(x0, y0);
              for (let i = 0; i < rest.length; i += 2) ctx.lineTo(rest[i], rest[i + 1]);
            }}
          >
            <URLImage
              src={image2}
              stageWidth={stageSize.width}
              stageHeight={stageSize.height}
              {...getAnimationProps(idx)}
            />
          </Layer>
        ))}
      </Stage>
    </div>
  );
}

export default FrameMotionScreen;
