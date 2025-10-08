// SketchScreen.jsx
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { Box, Button, useMediaQuery } from "@mui/material";
import image2 from "../../assets/image4.jpg";
import { getLineProps } from "./PenTools";
import URLImage from "../../components/URLImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";

const penTypes = [
  { value: "pen", label: "ノーマル", emoji: "✏️" },
  { value: "neon", label: "ネオン", emoji: "🌈" },
  { value: "glitter", label: "キラキラ", emoji: "✨" },
  { value: "transparent", label: "透明", emoji: "💧" },
  { value: "circle", label: "丸", emoji: "⭕" },
  { value: "balloon", label: "風船", emoji: "🎈" },
  { value: "jellyfish", label: "クラゲ", emoji: "🪼" },
  { value: "eraser", label: "消しゴム", emoji: "🩹" },
];

const colors = [
  "#ffb6c1", "#ffc0cb", "#ff69b4", "#ff1493", "#ff4500",
  "#ffa500", "#ffff00", "#adff2f", "#00fa9a", "#00ced1",
  "#1e90ff", "#9370db", "#ffffff", "#cccccc", "#000000"
];

const SketchScreen = () => {
  const isDrawing = useRef(false);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#ff69b4");
  const [shapes, setShapes] = useState([]);
  const history = useRef([[]]);
  const historyStep = useRef(0);
  const stageSize = useStageSize();

  const isMobile = useMediaQuery("(max-width: 600px)");
  const toolbarHeight = isMobile ? 240 : 180;

  // --- 描画ロジック ---
  const startDrawing = (pos) => {
    isDrawing.current = true;
    setShapes((prev) => [...prev, { points: [pos.x, pos.y], color, tool }]);
  };
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
  const endDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const newHistory = history.current.slice(0, historyStep.current + 1);
    newHistory.push([...shapes]);
    history.current = newHistory;
    historyStep.current = newHistory.length - 1;
    setShapes([...shapes]);
  };
  const handleUndo = () => {
    if (historyStep.current === 0) return;
    historyStep.current -= 1;
    setShapes(history.current[historyStep.current]);
  };
  const handleRedo = () => {
    if (historyStep.current === history.current.length - 1) return;
    historyStep.current += 1;
    setShapes(history.current[historyStep.current]);
  };
  const handleClear = () => {
    setShapes([]);
    history.current = [[]];
    historyStep.current = 0;
  };
  const getPointerPos = (e) => e.target.getStage().getPointerPosition();
  const handleDown = (e) => startDrawing(getPointerPos(e));
  const handleMove = (e) => drawMove(getPointerPos(e));

  useEffect(() => {
    const handleGlobalUp = () => (isDrawing.current = false);
    document.addEventListener("mouseup", handleGlobalUp);
    document.addEventListener("touchend", handleGlobalUp);
    return () => {
      document.removeEventListener("mouseup", handleGlobalUp);
      document.removeEventListener("touchend", handleGlobalUp);
    };
  }, []);

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="#fefaff"
      sx={{ overflow: "hidden", position: "relative" }}
    >
      {/* キャンバス部分 */}
      <Box
        sx={{
          height: `calc(100vh - ${toolbarHeight}px)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Stage
          width={stageSize.width}
          height={stageSize.height - toolbarHeight}
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={endDrawing}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={endDrawing}
        >
          {/* 背景画像 */}
          <Layer>
            <URLImage
              src={image2}
              stageWidth={stageSize.width}
              stageHeight={stageSize.height - toolbarHeight}
            />
          </Layer>

          {/* 描画レイヤー */}
          <Layer>
            {shapes.map((shape, i) => {
              const props = getLineProps(shape);

              // 🎈 風船ペン
              if (shape.tool === "balloon" || props.balloon) {
                return shape.points.reduce((arr, _, idx) => {
                  if (idx % 2 === 0) {
                    const radius = 6 + Math.random() * 6;
                    arr.push(
                      <Circle
                        key={`balloon-${i}-${idx}`}
                        x={shape.points[idx]}
                        y={shape.points[idx + 1]}
                        radius={radius}
                        fill={props.fill || shape.color}
                        shadowBlur={props.shadowBlur || 8}
                        shadowColor={props.shadowColor || "#fff"}
                        opacity={props.opacity || 0.8}
                      />
                    );
                  }
                  return arr;
                }, []);
              }

              // ✨ glitter ペン
              if (shape.tool === "glitter") {
                return (
                  <React.Fragment key={i}>
                    <Line {...props} />
                    {shape.points.reduce((arr, _, idx) => {
                      if (idx % 2 === 0) {
                        arr.push(
                          <Circle
                            key={`g-${i}-${idx}`}
                            x={shape.points[idx]}
                            y={shape.points[idx + 1]}
                            radius={Math.random() * 2 + 1}
                            fill="#fffacd"
                            opacity={Math.random()}
                          />
                        );
                      }
                      return arr;
                    }, [])}
                  </React.Fragment>
                );
              }

              // 🌈 ネオンペン
              if (shape.tool === "neon") {
                return (
                  <React.Fragment key={i}>
                    <Line
                      points={shape.points}
                      stroke={shape.color}
                      strokeWidth={12}
                      lineCap="round"
                      lineJoin="round"
                      tension={0.5}
                      opacity={0.4}
                    />
                    <Line {...props} />
                  </React.Fragment>
                );
              }

              // 🖊 通常ペン系
              return <Line key={i} {...props} />;
            })}
          </Layer>
        </Stage>
      </Box>

      {/* 下部ツールバー */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: `${toolbarHeight}px`,
          background: "white",
          borderTop: "2px solid #ffe4ec",
          boxShadow: "0 -2px 10px rgba(255,182,193,0.2)",
          borderRadius: "20px 20px 0 0",
          p: 2,
          zIndex: 10,
          overflowY: "auto",
        }}
      >
        {/* ペン選択 */}
        <Box display="flex" overflow="auto" gap={2} mb={2} px={1}>
          {penTypes.map((p) => (
            <Button
              key={p.value}
              onClick={() => setTool(p.value)}
              variant={tool === p.value ? "contained" : "outlined"}
              sx={{
                minWidth: 80,
                borderRadius: "16px",
                backgroundColor: tool === p.value ? "#ffe4f2" : "white",
                color: tool === p.value ? "#d63384" : "#555",
                boxShadow: tool === p.value ? "0 0 6px #ffb6c1" : "none",
              }}
            >
              <span style={{ fontSize: "20px", marginRight: "6px" }}>{p.emoji}</span>
              <span style={{ fontSize: "12px" }}>{p.label}</span>
            </Button>
          ))}
        </Box>

        {/* カラー選択 */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {colors.map((c) => (
            <Box
              key={c}
              onClick={() => setColor(c)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: c,
                cursor: "pointer",
                border: color === c ? "3px solid #ff69b4" : "2px solid white",
                boxShadow: color === c ? "0 0 8px #ff99cc" : "0 0 4px #ddd",
                transition: "0.2s",
              }}
            />
          ))}
        </Box>

        {/* 操作ボタン */}
        <Box display="flex" justifyContent="center" gap={2}>
          <Button onClick={handleUndo} size="small" sx={{ borderRadius: "12px" }}>↩️ Undo</Button>
          <Button onClick={handleRedo} size="small" sx={{ borderRadius: "12px" }}>↪️ Redo</Button>
          <Button onClick={handleClear} color="error" variant="contained" size="small" sx={{ borderRadius: "12px" }}>🧼 Clear</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SketchScreen;
