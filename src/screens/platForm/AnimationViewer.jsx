// src/components/AnimationViewer.jsx

import React, { useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { getLineProps } from "../../screens/animation/PenTools";
import URLImage from "../../components/URLImage";
import { supabase } from "../../supabaseClient";

const FRAME_INTERVAL = 100;

function AnimationViewer({ width = 600, height = 400, workId }) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    if (!workId) return;
    const fetchAnimation = async () => {
      const { data, error } = await supabase
        .from("animations")
        .select("animation_data")
        .eq("work_id", workId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("アニメーション取得エラー:", error);
        setAnimationData(null);
      } else if (!data) {
        setAnimationData(null);
      } else {
        setAnimationData(data.animation_data || {});
      }
    };
    fetchAnimation();
  }, [workId]);

  // shapes, stamps, selectedImage の分岐
  const shapes = animationData?.shapes || [];
  const stamps = animationData?.stamps || [];
  const bgImage = animationData?.selectedImage || null;

  // フレーム切り替え
  useEffect(() => {
    if (!Array.isArray(shapes) || shapes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % shapes.length);
    }, FRAME_INTERVAL);
    return () => clearInterval(interval);
  }, [shapes.length]);

  // 現在のフレーム
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
            return <Line key={i} {...props} />;
          })}
          {/* stamps の描画も必要なら追加 */}
        </Layer>
      </Stage>
    </div>
  );
}

export default AnimationViewer;