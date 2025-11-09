import React, { useState, useEffect, useRef ,useContext, useCallback } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { AnimationContext } from "../../context/AnimationContext";
import useImage from "use-image";
import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

//
import image2 from "../../assets/image4.jpg";

import { getLineProps } from "./PenTools";
import URLImage from "../../components/URLImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";

const SketchScreen = () => {
  const isDrawing = useRef(false);
  const [tool, setTool] = useState("pen"); // pen | eraser | glitter | neon
  const [color, setColor] = useState("#0ff");
  const [shapes, setShapes] = useState([]);
  const history = useRef([[]]);
  const historyStep = useRef(0);


  const stageSize = useStageSize();
  const { 
    selectedImage, 
    stamps, 
    currentShapes,
    pushShapeHistory,
    color: contextColor,
    setColor: setContextColor,
    tool: contextTool,
    setTool: setContextTool 
  } = useContext(AnimationContext);

  // ペンの種類
  const penTools = [
    { id: "pen", label: "通常ペン" },
    { id: "neon", label: "ネオンペン" },
    { id: "transparent", label: "透明ペン" },
    { id: "circle", label: "丸ペン" },
    { id: "eraser", label: "消しゴム" },
  ];

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

  // マウス・タッチ座標取得
  const getPointerPos = (e) => {
    if (e.evt.touches && e.evt.touches.length > 0) {
      const touch = e.evt.touches[0];
      const stage = e.target.getStage();
      return stage.getPointerPosition(touch);
    }
    return e.target.getStage().getPointerPosition();
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

  return (
    <Box width="100%" p={1}>

      {/*　ツール選択 */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <ToggleButtonGroup
          value={tool}
          exclusive
          onChange={(e, val) => val && setTool(val)}
          size="small"
        >
          <ToggleButton value="pen">Pen</ToggleButton>
          <ToggleButton value="eraser">Eraser</ToggleButton>
          <ToggleButton value="glitter">✨ Glitter</ToggleButton>
          <ToggleButton value="neon">🌈 Neon</ToggleButton>
          <ToggleButton value="transparent">transparent</ToggleButton>
          <ToggleButton value="circle">circle</ToggleButton>
          <ToggleButton value="balloon">🎈 Balloon</ToggleButton>
          <ToggleButton value="jellyfish">🪼jellyfish</ToggleButton>

        </ToggleButtonGroup>

        <Box display="flex" gap={1}>
          <Button onClick={handleUndo} variant="outlined" size="small">Undo</Button>
          <Button onClick={handleRedo} variant="outlined" size="small">Redo</Button>
          <Button onClick={handleClear} variant="contained" size="small" color="error">Clear</Button>
        </Box>
      </Box>

      {/* キャンバス */}
      <Box width="100%" height={stageSize.height} border="1px solid #dee2e6">
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
          <Layer>
            <URLImage src={image2} stageWidth={stageSize.width} stageHeight={stageSize.height} />
          </Layer>
          <Layer>
  
  {/* 定義したペンを取り出し、iの配列の順番にペンツールを描画 */}

  {shapes.map((shape, i) => (
    <React.Fragment key={i}>
      {/* ネオンペン用の太い半透明線 */}
      {shape.tool === "neon" && (
        <Line
          points={shape.points}
          stroke={shape.color}
          strokeWidth={12}
          lineCap="round"
          lineJoin="round"
          tension={0.5}
          opacity={0.4}
        />
      )}

     {/* 透明ペン */}
     <Line {...getLineProps(shape)} />


      {/* 効果用のエフェクトがないため*/}
      <Line {...getLineProps(shape)} />

      {/* キラキラ効果 */}
      {shape.tool === "glitter" &&
        shape.points.reduce((arr, _, idx) => {
          if (idx % 2 === 0) {
            arr.push(
              <Circle
                key={`glitter-${i}-${idx}`}
                x={shape.points[idx]}
                y={shape.points[idx + 1]}
                radius={Math.random() * 2 + 1}
                fill="#fffacd"
                opacity={Math.random()}
              />
            );
          }
          return arr;
        }, [])
      }

      {/* 風船効果 */}

      {shape.tool === "balloon" &&
        shape.points.reduce((arr, _, idx) => {
          if (idx % 2 === 0) {
            const radius = 6 + Math.random() * 6; // 大きさをランダムに
            arr.push(
              <Circle
                key={`balloon-${i}-${idx}`}
                x={shape.points[idx]}
                y={shape.points[idx + 1]}
                radius={radius}
                fill={shape.color}
                shadowBlur={8} // ぷっくり感
                shadowColor="#fff"
                opacity={0.8}
              />
            );
          }
          return arr;
        }, [])
      }

      {shape.tool === "jellyfish" &&
          shape.points.reduce((arr, _, idx) => {
            if (idx % 6 === 0) { // 点を間引きして配置
              arr.push(
                <Circle
                  key={`bubble-${i}-${idx}`}
                  x={shape.points[idx] + Math.random() * 20 - 10}
                  y={shape.points[idx + 1] + Math.random() * 20 - 10}
                  radius={1 + Math.random() * 3}
                  fill={shape.color}
                  opacity={0.1 + Math.random() * 0.4}
                />
              );
            }
            return arr;
          }, [])
        }

      

    </React.Fragment>
  ))}
</Layer>

        </Stage>
      </Box>

      <Box height={8} />

      {/* カラーパレット */}
      <ToggleButtonGroup
        value={color}
        exclusive
        onChange={(e, val) => val && setColor(val)}
      >
        {["#0ff", "#ff00ff", "#ff0", "#0f0", "#f00"].map((c) => (
          <ToggleButton
            key={c}
            value={c}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: c,
              "&.Mui-selected": { border: "2px solid black" },
            }}
          />
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default SketchScreen;
