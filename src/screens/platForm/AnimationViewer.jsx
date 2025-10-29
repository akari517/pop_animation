
import React from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import useImage from "use-image";

const AnimationViewer = ({ animationData, width, height }) => {
  const frames = animationData.frames || animationData.shapes || [];
  const stamps = animationData.stamps || [];
  const selectedImage = animationData.selectedImage || null;
  const savedWidth = animationData.savedWidth || width;
  const savedHeight = animationData.savedHeight || height;

  const [bgImage] = useImage(selectedImage);

  // スケール計算
  const scaleX = width / savedWidth;
  const scaleY = height / savedHeight;
  const scale = Math.min(scaleX, scaleY);

  // ステージ中央に合わせるオフセット
  const offsetX = (width - savedWidth * scale) / 2;
  const offsetY = (height - savedHeight * scale) / 2;

  return (
    <Stage width={width} height={height}>
      <Layer x={offsetX} y={offsetY} scale={{ x: scale, y: scale }}>
        {bgImage && (
          <Image image={bgImage} x={0} y={0} width={savedWidth} height={savedHeight} />
        )}
        {frames.map((shape, i) => (
          <Line
            key={i}
            points={shape.points || []}
            stroke={shape.color || "#000"}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
        ))}
        {stamps.map((stamp, i) => (
          stamp.image ? (
            <Image
              key={i}
              image={stamp.image}
              x={stamp.x}
              y={stamp.y}
              width={stamp.width}
              height={stamp.height}
            />
          ) : null
        ))}
      </Layer>
    </Stage>
  );
};

export default AnimationViewer;
