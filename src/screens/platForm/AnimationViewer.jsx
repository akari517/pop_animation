// src/components/AnimationViewer.jsx

import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Image as KonvaImage } from "react-konva";
import { getLineProps } from "../../screens/animation/PenTools";
import URLImage from "../../components/URLImage";

const FRAME_INTERVAL = 100;

function AnimationViewer({ width = 600, height = 400, animationData }) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const shapes = animationData?.shapes || [];
  const stamps = animationData?.stamps || [];
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

  console.log("animationData", animationData);

  return (
    <div>
      <Stage width={width} height={height}>
        <Layer>
          {bgImage && (
            <URLImage
              src={bgImage}
              width={width}
              height={height}
              x={0}
              y={0}
            />
          )}
        </Layer>
        <Layer>
          {currentFrameShapes.map((shape, i) => {
            const props = getLineProps(shape);
            return <Line key={i} {...props} />;
          })}
          {Array.isArray(stamps) &&
            stamps.map((stamp, idx) => (
              <StampImage
                key={stamp.id || idx}
                src={stamp.src}
                x={stamp.x}
                y={stamp.y}
                width={stamp.width}
                height={stamp.height}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
}

// StampImageコンポーネントを追加
function StampImage({ src, x, y, width, height }) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);
  return image ? (
    <KonvaImage image={image} x={x} y={y} width={width} height={height} />
  ) : null;
}

export default AnimationViewer;