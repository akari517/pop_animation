import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
import { getLineProps } from "../../screens/animation/PenTools";
import URLImage from "../../components/URLImage";

function StampImage({ src, x, y, width, height }) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
  }, [src]);
  return image ? (
    <KonvaImage image={image} x={x} y={y} width={width} height={height} />
  ) : null;
}

const DEFAULT_FPS = 10;

function AnimationViewer({ width = 600, height = 400, animationData }) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);

  const frames = animationData?.frames || [];
  const stamps = animationData?.stamps || [];
  const bgImage = animationData?.selectedImage || null;
  const fps = animationData?.frameRate || DEFAULT_FPS;
  const frameIntervalMs = 1000 / fps;

  // 補正用：保存時キャンバスサイズ
  const savedWidth = animationData?.canvasWidth || width;
  const savedHeight = animationData?.canvasHeight || height;
  const scaleX = width / savedWidth;
  const scaleY = height / savedHeight;

  useEffect(() => setCurrentFrameIndex(0), [frames.length]);

  useEffect(() => {
    if (!frames || frames.length <= 1) return;

    const step = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      if (delta >= frameIntervalMs) {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
        lastTimeRef.current = time;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [frames.length, frameIntervalMs]);

  if (!frames.length) return <div>アニメーションがありません</div>;

  const currentFrameShapes = frames[currentFrameIndex] || [];

  // フレーム内の最小座標を求める（左上補正用）
  const minX = Math.min(
    ...currentFrameShapes.flatMap((s) =>
      s.points.filter((_, idx) => idx % 2 === 0)
    ),
    0
  );
  const minY = Math.min(
    ...currentFrameShapes.flatMap((s) =>
      s.points.filter((_, idx) => idx % 2 !== 0)
    ),
    0
  );

  return (
    <Stage width={width} height={height}>
      <Layer>
        {bgImage && <URLImage src={bgImage} width={width} height={height} x={0} y={0} />}
      </Layer>
      <Layer>
        {currentFrameShapes.map((shape, i) => {
          const correctedPoints = shape.points.map((v, idx) =>
            idx % 2 === 0 ? (v - minX) * scaleX : (v - minY) * scaleY
          );
          const props = getLineProps({ ...shape, points: correctedPoints });
          return <Line key={i} {...props} />;
        })}
        {stamps.map((stamp, idx) => (
          <StampImage
            key={stamp.id || idx}
            src={stamp.src}
            x={stamp.x * scaleX}
            y={stamp.y * scaleY}
            width={stamp.width * scaleX}
            height={stamp.height * scaleY}
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default AnimationViewer;
