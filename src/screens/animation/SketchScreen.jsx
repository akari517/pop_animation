import React, { useEffect, useRef, useContext } from "react";
import { AnimationContext } from "../../context/AnimationContext.jsx";
import { Stage, Layer, Line, Circle } from "react-konva";
import { Box, Button, useMediaQuery } from "@mui/material";
import { getLineProps } from "./PenTools";
import URLImage from "../../components/URLImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";


const SketchScreen = () => {
  const isDrawing = useRef(false);
  const { currentShapes, pushShapeHistory, undo, redo, clear, selectedImage, color, tool, setTool, setColor } = useContext(AnimationContext);
  const stageSize = useStageSize(70);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const toolbarHeight = isMobile ? 240 : 180;
  const contentHeight = Math.max(100, stageSize.height - toolbarHeight);

  const getPointerPos = (e) => e.target.getStage().getPointerPosition();

  const startDrawing = (pos) => {
    isDrawing.current = true;
    pushShapeHistory([...currentShapes, { points: [pos.x, pos.y], color, tool }]);
  };

  const drawMove = (pos) => {
    if (!isDrawing.current) return;
    const lastShape = currentShapes[currentShapes.length - 1];
    const newShapes = [
      ...currentShapes.slice(0, -1),
      { ...lastShape, points: [...lastShape.points, pos.x, pos.y] },
    ];
    pushShapeHistory(newShapes);
  };

  const endDrawing = () => {
    isDrawing.current = false;
  };

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
    <Box width="100%" height="100vh" display="flex" flexDirection="column" bgcolor="#fcfffdff" sx={{ overflow: "hidden", position: "relative" }}>
      <Box sx={{ height: `${contentHeight}px`, display: "flex", justifyContent: "center", alignItems: "flex-start", position: "relative" }}>
        <Stage
          width={stageSize.width}
          height={contentHeight}
          onMouseDown={e => startDrawing(getPointerPos(e))}
          onMouseMove={e => drawMove(getPointerPos(e))}
          onMouseUp={endDrawing}
          onTouchStart={e => startDrawing(getPointerPos(e))}
          onTouchMove={e => drawMove(getPointerPos(e))}
          onTouchEnd={endDrawing}
        >
          <Layer>
            {selectedImage && <URLImage src={selectedImage} stageWidth={stageSize.width} stageHeight={contentHeight} />}
          </Layer>
          <Layer>
            {currentShapes.map((shape, i) => {
              const props = getLineProps(shape);
              if (shape.tool === "balloon" || props.balloon) {
                return shape.points.reduce((arr, _, idx) => {
                  if (idx % 2 === 0) arr.push(<Circle key={`balloon-${i}-${idx}`} x={shape.points[idx]} y={shape.points[idx+1]} radius={6 + Math.random() * 6} fill={props.fill || shape.color} />);
                  return arr;
                }, []);
              }
              if (shape.tool === "glitter") {
                return (
                  <React.Fragment key={i}>
                    <Line {...props} />
                    {shape.points.reduce((arr, _, idx) => {
                      if (idx % 2 === 0) arr.push(<Circle key={`g-${i}-${idx}`} x={shape.points[idx]} y={shape.points[idx+1]} radius={Math.random()*2+1} fill="#fffacd" opacity={Math.random()} />);
                      return arr;
                    }, [])}
                  </React.Fragment>
                );
              }
              if (shape.tool === "neon") {
                return (
                  <React.Fragment key={i}>
                    <Line points={shape.points} stroke={shape.color} strokeWidth={12} lineCap="round" lineJoin="round" tension={0.5} opacity={0.4} />
                    <Line {...props} />
                  </React.Fragment>
                );
              }
              return <Line key={i} {...props} />;
            })}
          </Layer>
        </Stage>
      </Box>

      {/* 下部ツールバー */}
      <Box sx={{ position: "fixed", bottom: "70px", left: 0, width: "100%", height: `${toolbarHeight}px`, background: "white", borderTop: "2px solid #D6F4DE", boxShadow: "0 -2px 10px rgba(255,182,193,0.2)", borderRadius: "20px 20px 0 0", p: 2, zIndex:1100, overflowY:"auto" }}>
        <Box display="flex" overflow="auto" gap={2} mb={2} px={1}>
          <Button onClick={() => setTool("pen")}>ペン</Button>
          <Button onClick={() => setTool("eraser")}>消しゴム</Button>
        </Box>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button onClick={undo} size="small">↩️ Undo</Button>
          <Button onClick={redo} size="small">↪️ Redo</Button>
          <Button onClick={clear} color="error" variant="contained" size="small">🧼 Clear</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SketchScreen;
