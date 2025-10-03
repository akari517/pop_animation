export const getLineProps = (shape) => {
  const base = {
    points: shape.points,
    tension: 0.5,
    lineCap: "round",
    lineJoin: "round",
    globalCompositeOperation:
      shape.tool === "eraser" ? "destination-out" : "source-over",
  };

  if (shape.tool === "neon") {
    return {
      ...base,
      stroke: shape.color,
      strokeWidth: 4,
      shadowColor: shape.color,
      shadowBlur: 30,
      shadowOpacity: 0.9,
    };
  }
  
  if (shape.tool === "transparent") {
  return {
    ...base,
    stroke: shape.color,
    strokeWidth: 10,
    shadowColor: shape.color,
    shadowBlur: 30,
    shadowOpacity: 0.5,  // 光の強さを少し弱める
    opacity: 0.2,         // 透明度を強める
  };
}

  if (shape.tool === "circle") {
    return {
      ...base,
      stroke: shape.color,
      strokeWidth: 10,        // 丸ペンの太さ
      shadowColor: "#fff",    // 光沢
      shadowBlur: 8,
      shadowOpacity: 0.6,
    };
  }



  if (shape.tool === "balloon") {
  return {
    // ダミー Line プロップは不要
    balloon: true, // 後でLayerで処理
  };
  }

  if (shape.tool === "jellyfish") {
  return {
    ...base,
    stroke: shape.color,
    strokeWidth: 20,
    opacity: 0.30,           // かなり透明
    shadowColor: shape.color,
    shadowBlur: 40,          // 光のにじみ
  };
}



  return {
    ...base,
    stroke: shape.color,
    strokeWidth: shape.tool === "eraser" ? 20 : 6,
  };
};