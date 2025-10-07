import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Circle, Image } from "react-konva";

import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import { useDrawing } from "../../components/useDrawing";

//画像のpath
import image2 from "../../assets/image4.jpg";

import { getLineProps } from "./PenTools";
import URLImage from "../../components/URLImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";

const SketchScreen = () => {
  const isDrawing = useRef(false);
  const history = useRef([[]]);
  const historyStep = useRef(0)
  const stageSize = useStageSize();

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
          <Button onClick={undo} variant="outlined" size="small">Undo</Button>
          <Button onClick={redo} variant="outlined" size="small">Redo</Button>
          <Button onClick={clear} variant="contained" size="small" color="error">Clear</Button>
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
