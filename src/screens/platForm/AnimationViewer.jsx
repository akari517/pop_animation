import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
import { getLineProps } from "../../screens/animation/PenTools"; // パスは環境に合わせてください

function AnimationViewer({ animationData, width, height }) {
  // アニメーション制御用
  const allFrames = animationData?.frames || [];
  const frameInterval = animationData?.frameInterval || 250;
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // フレームデータがない場合はStageを空で返す
  if (allFrames.length === 0) {
    return <Stage width={width} height={height}><Layer /></Stage>;
  }

  // フレーム切り替えロジック（アニメーション再生）
  useEffect(() => {
    if (allFrames.length < 2) return; 

    const timer = setInterval(() => {
      // フレームをループ再生
      setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % allFrames.length);
    }, frameInterval);

    return () => clearInterval(timer);
  }, [allFrames.length, frameInterval]);

  // 現在表示すべきフレームのデータ
  const currentFrame = allFrames[currentFrameIndex];
  
  // 描画データ
  const shapes = currentFrame?.shapes || [];
  const stamps = currentFrame?.stamps || [];
  
  // 背景やサイズ情報
  const bgImageSrc = animationData?.selectedImage || null;
  const savedWidth = animationData?.savedWidth || width; 
  const savedHeight = animationData?.savedHeight || height;

  // 🌟 座標ズレ対策: スケール計算と中央寄せ 🌟
  const scaleX = width / savedWidth;
  const scaleY = height / savedHeight;
  const scale = Math.min(scaleX, scaleY); // コンテイン表示

  const offsetX = (width - savedWidth * scale) / 2;
const offsetY = (height - savedHeight * scale) / 2;
console.log("offsetX:", offsetX, "width:", width, "savedWidth:", savedWidth, "scale:", scale);

  // --- 内部コンポーネント ---
  function BackgroundImage({ src }) {
    const [image, setImage] = useState(null);
    useEffect(() => {
      if (!src) return;
      const img = new window.Image();
      img.src = src;
      img.onload = () => setImage(img);
    }, [src]);

    return image ? (
      <KonvaImage
        image={image}
        width={savedWidth}
        height={savedHeight}
      />
    ) : null;
  }

  function StampImage({ stamp }) {
    const [image, setImage] = useState(null);
    useEffect(() => {
      if (!stamp.src) return;
      const img = new window.Image();
      img.src = stamp.src;
      img.onload = () => setImage(img);
    }, [stamp.src]);

    return image ? (
      <KonvaImage
        image={image}
        x={stamp.x}
        y={stamp.y}
        width={stamp.width || 100}
        height={stamp.height || 100}
      />
    ) : null;
  }
  // -------------------------

  return (
    <Stage width={width} height={height}>
      {/* 🌟 Layer全体にスケールとオフセットを適用 🌟 */}
      <Layer x={offsetX} y={offsetY} scale={{ x: scale, y: scale }}>
        {bgImageSrc && <BackgroundImage src={bgImageSrc} />}
        {Array.isArray(shapes) &&
          shapes.map((shape, i) => {
            const props = getLineProps(shape); 
            return <Line key={i} {...props} />;
          })}
        {Array.isArray(stamps) &&
          stamps.map((stamp, i) => <StampImage key={i} stamp={stamp} />)}
      </Layer>
    </Stage>
  );
}

export default AnimationViewer;