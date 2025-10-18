import React, { useState, useEffect, useRef, useContext } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import image2 from "../../assets/image4.jpg";
import { AnimationContext } from "../../context/AnimationContext";
import { useStageSize } from "../../components/useStageSize.jsx";
import { useDrawing } from "../../components/useDrawing";
import { getAnimProps, animationList } from "./FrameMotionAnimation.js";
import AnimationMenu from "../../components/AnimationMenu";

function FrameMotionScreen() {
  const stageSize = useStageSize(70);
  const { selectedImage, stamps, setStamps, saveAnimation, workId } = useContext(AnimationContext);
  const [bg] = useImage(selectedImage || image2);
  const { shapes, handleDown, handleMove, endDrawing, setShapes } = useDrawing([], "#0ff", "pen");
  const [selectedShape, setSelectedShape] = useState(null);

  const cutImages = useRef({});

  // 線を閉じて切り抜き画像を作成
  const closeShapeIfNeeded = () => {
    setShapes(prev => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (!last || last.points.length <= 2) return updated;

      // 線を閉じる
      const [x0, y0] = last.points;
      const [xEnd, yEnd] = last.points.slice(-2);
      if (x0 !== xEnd || y0 !== yEnd) last.points.push(x0, y0);

      // 範囲計算
      const xs = last.points.filter((_, i) => i % 2 === 0);
      const ys = last.points.filter((_, i) => i % 2 === 1);
      last.width = Math.max(...xs) - Math.min(...xs);
      last.height = Math.max(...ys) - Math.min(...ys);
      last.minX = Math.min(...xs);
      last.minY = Math.min(...ys);

      // 初期状態
      last.animation = "bounce";
      last.tick = 0;

      const idx = updated.findIndex(s => s === last);

      // 切り抜き画像生成
      if (bg) {
        const offCanvas = document.createElement("canvas");
        offCanvas.width = last.width;
        offCanvas.height = last.height;
        const ctx = offCanvas.getContext("2d");

        ctx.beginPath();
        last.points.forEach((val, i) => {
          if (i % 2 === 0) {
            const x = val - last.minX;
            const y = last.points[i + 1] - last.minY;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(bg, -last.minX, -last.minY, stageSize.width, stageSize.height);
        cutImages.current[idx] = offCanvas;
      }

      return updated;
    });
  };

  // 各線のtickを個別に進めるアニメーションループ
  useEffect(() => {
    let animationId;
    const animate = () => {
      setShapes(prev =>
        prev.map(line => ({
          ...line,
          tick: (line.tick || 0) + 0.05
        }))
      );
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // アニメーション切り替え（線ごと）
  const changeAnimation = (animKey, idx) => {
    setShapes(prev =>
      prev.map((line, i) =>
        i === idx ? { ...line, animation: animKey } : line
      )
    );
  };

  // 保存ボタンの処理
  const handleSave = () => {
    if (!workId) {
      alert("workIdが未設定です");
      return;
    }
    saveAnimation();
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", background: "#fcfffdff", overflow: "hidden" }}>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={() => { endDrawing(); closeShapeIfNeeded(); }}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={() => { endDrawing(); closeShapeIfNeeded(); }}
      >
        {/* 背景 */}
        <Layer>
          {bg && <KonvaImage image={bg} width={stageSize.width} height={stageSize.height} />}
        </Layer>

        {/* 線 */}
        <Layer>
          {shapes.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
              tension={0.5}
              onClick={() => setSelectedShape(i)}
              opacity={selectedShape === i ? 1 : 0.7}
            />
          ))}
        </Layer>

        {/* 切り抜いた部分にアニメーション適用 */}
        {shapes.map((line, idx) => {
          const cutImg = cutImages.current[idx];
          if (!cutImg) return null;
          const animProps = line.animation ? getAnimProps(line.animation, line.tick, idx, line.width || 200) : {};

          return (
            <Layer key={`anim-${idx}`}>
              <KonvaImage
                image={cutImg}
                x={line.minX + line.width / 2 + (animProps.x || 0)}
                y={line.minY + line.height / 2 + (animProps.y || 0)}
                width={line.width}
                height={line.height}
                scaleX={animProps.scaleX || 1}
                scaleY={animProps.scaleY || 1}
                rotation={animProps.rotation || 0}
                offsetX={line.width / 2}
                offsetY={line.height / 2}
              />
            </Layer>
          );
        })}
      </Stage>

      {/* 各線のアニメーションボタン */}
      <div style={{ marginTop: 20 }}>
        {shapes.map((line, idx) => (
          <div key={idx} style={{ marginBottom: 14 }}>
            <span style={{ fontWeight: "bold", marginRight: 8 }}>図形 {idx + 1}：</span>
            {animationList.map(btn => {
              const isActive = line.animation === btn.key;
              return (
                <button
                  key={btn.key}
                  onClick={() => changeAnimation(btn.key, idx)}
                  style={{
                    margin: "0 5px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    backgroundColor: isActive ? "#ff9800" : "#4caf50",
                    color: "#fff",
                    boxShadow: isActive
                      ? "0 4px 10px rgba(0,0,0,0.3)"
                      : "0 4px 6px rgba(0,0,0,0.2)",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.1s ease-in-out",
                  }}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 保存ボタン */}
      <button onClick={handleSave} style={{ marginTop: 20, padding: "10px 20px", fontSize: 16, borderRadius: 8, border: "none", cursor: "pointer", backgroundColor: "#2196F3", color: "#fff", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", transition: "background-color 0.3s ease" }}>
        💾 Save
      </button>

      {/* 画面下部メニュー */}
      <AnimationMenu />
    </div>
  );
}

export default FrameMotionScreen;

