export const getLineProps = (shape) => {
  const base = { // 共通プロップ
    points: shape.points,
    tension: 0.5,
    lineCap: "round",
    lineJoin: "round",
    globalCompositeOperation:
      shape.tool === "eraser" ? "destination-out" : "source-over",
  };

  if (shape.tool === "neon") { // ネオンペン
    return {
      ...base,
      stroke: shape.color,
      strokeWidth: 4,
      shadowColor: shape.color,
      shadowBlur: 30,
      shadowOpacity: 0.9,
    };
  }

  if (shape.tool === "transparent") { // 透明ペン
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

  if (shape.tool === "circle") { // 丸ペン
    return {
      ...base,
      stroke: shape.color,
      strokeWidth: 10,        // 丸ペンの太さ
      shadowColor: "#fff",    // 光沢
      shadowBlur: 8,
      shadowOpacity: 0.6,
    };
  }



  if (shape.tool === "balloon") { // 🎈風船ペン
    return {
      ...base,
      balloon: true,       // balloonモードを示すフラグ
      fill: shape.color,   // Circle描画時に使う色
      shadowBlur: 8,
      shadowColor: "#fff",
      opacity: 0.8,
    };
  }



  if (shape.tool === "jellyfish") { // クラゲペン
    return {
      ...base,
      stroke: shape.color,
      strokeWidth: 20,
      opacity: 0.30,           // かなり透明
      shadowColor: shape.color,
      shadowBlur: 40,          // 光のにじみ
    };
  }



  return {  // 通常ペン、消しゴム
    ...base,
    stroke: shape.color,
    strokeWidth: shape.tool === "eraser" ? 20 : 6,
  };
};