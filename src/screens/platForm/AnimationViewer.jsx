// src/components/AnimationViewer.jsx

import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { getLineProps } from "../../screens/animation/PenTools";
import URLImage from "../../components/URLImage";

const FRAME_INTERVAL = 100;

function AnimationViewer({ width = 600, height = 400, animationData }) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const shapes = animationData?.shapes || [];
  const bgImage = animationData?.selectedImage || null;

  useEffect(() => {
    if (!Array.isArray(shapes) || shapes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % shapes.length);
    }, FRAME_INTERVAL);
    return () => clearInterval(interval);
  }, [shapes.length]);

  const currentFrameShapes = Array.isArray(shapes[0])
    ? shapes[currentFrameIndex] || []
    : shapes;

  if (!animationData || !Array.isArray(currentFrameShapes)) {
    return <div>アニメーションがありません</div>;
  }

  return (
    <div>
      <Stage width={width} height={height}>
        <Layer>
          {bgImage && (
            <URLImage
              src={bgImage}
              stageWidth={width}
              stageHeight={height}
              x={0}
              y={0}
              width={width}
              height={height}
            />
          )}
        </Layer>
        <Layer>
          {currentFrameShapes.map((shape, i) => {
            const props = getLineProps(shape);

            // 風船ペン
            if (shape.tool === "balloon" || props.balloon) {
              return shape.points.reduce((arr, _, idx) => {
                if (idx % 2 === 0) {
                  arr.push(
                    <Circle
                      key={`balloon-${i}-${idx}`}
                      x={shape.points[idx]}
                      y={shape.points[idx + 1]}
                      radius={6 + Math.random() * 6}
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

            // キラキラペン
            if (shape.tool === "glitter") {
              return (
                <React.Fragment key={i}>
                  <Line {...props} />
                  {shape.points.reduce((arr, _, idx) => {
                    if (idx % 2 === 0)
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
                    return arr;
                  }, [])}
                </React.Fragment>
              );
            }

            // ネオンペン
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

            // その他
            return <Line key={i} {...props} />;
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default AnimationViewer;