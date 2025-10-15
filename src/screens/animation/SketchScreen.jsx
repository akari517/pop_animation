// SketchScreen.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { AnimationContext } from "../../context/AnimationContext";
import { Stage, Layer, Line, Circle } from "react-konva";
import { Box, Button, useMediaQuery } from "@mui/material";
import image2 from "../../assets/image4.jpg";
import { getLineProps } from "./PenTools";
import URLImage from "../../components/URLImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";
//a
const penTypes = [
  { value: "pen", label: "ノーマル" },
  { value: "neon", label: "ネオン" },
  { value: "glitter", label: "キラキラ" },
  { value: "transparent", label: "透明" },
  { value: "circle", label: "丸" },
  { value: "balloon", label: "風船" },
  { value: "jellyfish", label: "クラゲ" },
  { value: "eraser", label: "消しゴム" },
];

const colors = [
  "#ffb6c1", "#ffc0cb", "#ff69b4", "#ff1493", "#ff4500",
  "#ffa500", "#ffff00", "#adff2f", "#00fa9a", "#00ced1",
  "#1e90ff", "#9370db", "#ffffff", "#cccccc", "#000000"
];

const SketchScreen = () => {
  const isDrawing = useRef(false);
  const { selectedImage, shapes: ctxShapes, setShapes: setCtxShapes, tool: ctxTool, setTool: setCtxTool, color: ctxColor, setColor: setCtxColor } = useContext(AnimationContext);
  const [toolLocal, setToolLocal] = useState(ctxTool || "pen");
  const [colorLocal, setColorLocal] = useState(ctxColor || "#ffb6c1");
  const [shapes, setShapes] = useState(ctxShapes || []);
  const history = useRef([[]]);
  const historyStep = useRef(0);
  const stageSize = useStageSize(70);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const toolbarHeight = isMobile ? 240 : 180;

  const contentHeight = Math.max(100, stageSize.height - toolbarHeight);

  // --- 描画ロジック ---
  const startDrawing = (pos) => {
    isDrawing.current = true;
    setShapes((prev) => [...prev, { points: [pos.x, pos.y], color: colorLocal, tool: toolLocal }]);
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
    // Sync to global context
    setCtxShapes([...shapes]);
  };
  const handleUndo = () => {
    if (historyStep.current === 0) return;
    historyStep.current -= 1;
    setShapes(history.current[historyStep.current]);
    setCtxShapes(history.current[historyStep.current]);
  };
  const handleRedo = () => {
    if (historyStep.current === history.current.length - 1) return;
    historyStep.current += 1;
    setShapes(history.current[historyStep.current]);
    setCtxShapes(history.current[historyStep.current]);
  };
  const handleClear = () => {
    setShapes([]);
    history.current = [[]];
    historyStep.current = 0;
    setCtxShapes([]);
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
      bgcolor="#fcfffdff"
      sx={{ overflow: "hidden", position: "relative" }}
    >
      {/* キャンバス部分 */}
      <Box
        sx={{
          height: `${contentHeight}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <Stage
          width={stageSize.width}
          height={contentHeight}
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
              src={selectedImage || image2}
              stageWidth={stageSize.width}
              stageHeight={contentHeight}
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
          bottom: "70px", // move above the global bottom menu (AnimationMenu height)
          left: 0,
          width: "100%",
          height: `${toolbarHeight}px`,
          background: "white",
          borderTop: "2px solid #D6F4DE",
          boxShadow: "0 -2px 10px rgba(255,182,193,0.2)",
          borderRadius: "20px 20px 0 0",
          p: 2,
          zIndex: 1100, // ensure it's above the bottom menu
          overflowY: "auto",
        }}
      >
        {/* ペン選択 */}
        <Box display="flex" overflow="auto" gap={2} mb={2} px={1}>
          {penTypes.map((p) => (
            <Button
              key={p.value}
              onClick={() => {
                setToolLocal(p.value);
                setCtxTool(p.value);
              }}
              variant={toolLocal === p.value ? "contained" : "outlined"}
              sx={{
                minWidth: 80,
                borderRadius: "16px",
                backgroundColor: toolLocal === p.value ? "#D6F4DE" : "white",
                color: toolLocal === p.value ? "#2b5f39ff" : "#555",
              }}
            >
              <Box sx={{ width: 56, height: 36, mr: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.value === "eraser" ? (
                  <span style={{ fontSize: 20 }}>🩹</span>
                ) : (
                  <PenPreview
                    tool={p.value}
                    sampleColor={p.value === "eraser" ? "#ffffff" : colorLocal}
                  />
                )}
              </Box>
              <span style={{ fontSize: "12px" }}>{p.label}</span>
            </Button>
          ))}
        </Box>

        {/* カラー選択 */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {colors.map((c) => (
            <Box
              key={c}
              onClick={() => {
                setColorLocal(c);
                setCtxColor(c);
              }}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: c,
                cursor: "pointer",

                border: colorLocal === c ? "3px solid #17f051ff" : "2px solid white",
                boxShadow: colorLocal === c ? "0 0 8px #90eea9ff" : "0 0 4px #ddd",
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

// ---- 追加：ツール用の小さなプレビューコンポーネント ----
const PenPreview = ({ tool, sampleColor = "#ffb6c1" }) => {
  const samplePoints = [6, 28, 18, 10, 36, 26];
  const shape = { points: samplePoints, color: sampleColor, tool };
  const props = getLineProps(shape);

  // glitter の小さな点群生成
  const glitterDots = samplePoints.reduce((arr, _, idx) => {
    if (idx % 2 === 0) {
      arr.push(
        <Circle
          key={`g-${idx}`}
          x={samplePoints[idx]}
          y={samplePoints[idx + 1]}
          radius={Math.random() * 1.5 + 0.7}
          fill="#fffacd"
          opacity={0.8}
        />
      );
    }
    return arr;
  }, []);

  // balloon 用の複数丸
  const balloonDots = samplePoints.reduce((arr, _, idx) => {
    if (idx % 2 === 0) {
      const radius = 3 + Math.random() * 3;
      arr.push(
        <Circle
          key={`b-${idx}`}
          x={samplePoints[idx]}
          y={samplePoints[idx + 1]}
          radius={radius}
          fill={props.fill || sampleColor}
          shadowBlur={props.shadowBlur || 4}
          shadowColor={props.shadowColor || "#fff"}
          opacity={0.9}
        />
      );
    }
    return arr;
  }, []);

  return (
    <Stage width={56} height={36} style={{ display: "block" }}>
      <Layer>
        {tool === "balloon" ? (
          balloonDots
        ) : tool === "glitter" ? (
          <>
            <Line {...props} />
            {glitterDots}
          </>
        ) : tool === "neon" ? (
          <>
            <Line
              points={samplePoints}
              stroke={sampleColor}
              strokeWidth={8}
              lineCap="round"
              lineJoin="round"
              tension={0.5}
              opacity={0.4}
            />
            <Line {...props} />
          </>
        ) : (
          <Line {...props} />
        )}
      </Layer>
    </Stage>
  );
};
