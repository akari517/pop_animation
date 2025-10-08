import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import image2 from "../../assets/image4.jpg";
import { useStageSize } from "../../components/useStageSize.jsx";
import { useDrawing } from "../../components/useDrawing";

function FrameMotionScreen() {
  const stageSize = useStageSize();
  const [tick, setTick] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState(null); // "bounce" | "wave" | "pulse"
  const [bg] = useImage(image2);
  const { shapes, handleDown, handleMove, endDrawing } = useDrawing([], "#0ff", "pen");

  // ⏱️ アニメーションループ
  useEffect(() => {
    if (!activeAnimation) return;
    let animationId;
    const animate = () => {
      setTick((t) => t + 0.05); // やや緩やかに
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [activeAnimation]);

  // 🎞️ 各アニメーションの動作定義
  const getAnimProps = (idx) => {
    switch (activeAnimation) {
      case "bounce": {
        const bounce = 1 + Math.sin(tick / (10 + idx * 2)) * 0.12;
        const offsetY = Math.sin(tick / (8 + idx)) * 4;
        return { scaleX: bounce, scaleY: bounce, y: offsetY };
      }
      case "wave": {
        const offsetY = Math.sin(tick / (5 + idx)) * 10;
        const offsetX = Math.cos(tick / (6 + idx)) * 3;
        return { x: offsetX, y: offsetY };
      }
      case "pulse": {
        const scale = 1 + Math.sin(tick / (7 + idx)) * 0.06;
        const opacity = 0.9 + Math.sin(tick / (5 + idx)) * 0.1;
        return { scaleX: scale, scaleY: scale, opacity };
      }
      default:
        return {};
    }
  };

  // 🧭 UI
  const buttons = [
    { key: "bounce", label: "バネ" },
    { key: "wave", label: "波" },
    { key: "pulse", label: "パルス" },
  ];

  return (
    <div className="frame-container" style={{ textAlign: "center", padding: 10 }}>
      {/* 🎛 アニメーション切り替えボタン */}
      <div style={{ marginBottom: 8 }}>
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={() =>
              setActiveAnimation((prev) => (prev === btn.key ? null : btn.key))
            }
            style={{
              margin: "0 5px",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              background:
                activeAnimation === btn.key ? "#007bff" : "#e0e0e0",
              color: activeAnimation === btn.key ? "#fff" : "#333",
              transition: "0.2s",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 🖼 Konva ステージ */}
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
        {/* 背景 */}
        <Layer>
          {bg && (
            <KonvaImage
              image={bg}
              width={stageSize.width}
              height={stageSize.height}
            />
          )}
        </Layer>

        {/* 描いた線 */}
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

        {/* ✨ Clip範囲内アニメーション */}
        {shapes.map((line, idx) => (
          <Layer
            key={`anim-${idx}`}
            clipFunc={(ctx) => {
              if (line.points.length < 2) return;
              ctx.beginPath();
              const [x0, y0, ...rest] = line.points;
              ctx.moveTo(x0, y0);
              for (let i = 0; i < rest.length; i += 2)
                ctx.lineTo(rest[i], rest[i + 1]);
              ctx.closePath();
            }}
          >
            {bg && (
              <KonvaImage
                image={bg}
                width={stageSize.width}
                height={stageSize.height}
                {...getAnimProps(idx)}
              />
            )}
          </Layer>
        ))}
      </Stage>
    </div>
  );
}

export default FrameMotionScreen;
