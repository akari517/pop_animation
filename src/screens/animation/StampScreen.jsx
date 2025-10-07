import React, { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import "./FrameMotionScreen.css";
import image2 from "../../assets/image4.jpg";
import URLImage from "../../components/URLImage.jsx";
import StampImage from "../../components/StampImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";
import { useDrawing } from "../../components/useDrawing";
// TODO: スタンプの大きさ変更、回転機能など
// TODO: スタンプの削除機能
// TODO: やり直し機能

// TODO: 動的にとってこれるようにする
import book_flip from "../../assets/book_flip.gif";
import tree_wind from "../../assets/tree_wind.gif";
import star from "../../assets/star.gif";
import heart_pulse from "../../assets/heart_pulse.gif";
import pointer from "../../assets/pointer.gif";

function FrameMotionScreen() {
  const stageSize = useStageSize();
  const [stamps, setStamps] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);

  const {
    handleDown,
    handleMove,
    endDrawing,
  } = useDrawing([], "#0ff", "pen");

  const gifs = [
    { src: book_flip, name: "book_flip" },
    { src: tree_wind, name: "tree_wind" },
    { src: pointer, name: "pointer" },
    { src: heart_pulse, name: "heart_pulse" },
    { src: star, name: "star" },
  ];

  // Konvaエラー処理とブラウザ警告
  useEffect(() => {
    // Konvaエラーを抑制する処理
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && args[0].includes && args[0].includes("Brave shield")) {
        // Braveシールド警告を抑制しないが、ユーザーに通知
        console.log("⚠️ Braveブラウザのシールド機能が検出されました。正常に動作しない場合はシールドを無効にしてください。");
      } else {
        originalWarn.apply(console, args);
      }
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  // GIF選択ハンドラー
  const handleGifSelect = (gif) => {
    console.log("GIF選択:", gif.name);
    setSelectedGif(gif);
  };

  // ステージクリックハンドラー
  const handleStageClick = (e) => {
    if (selectedGif) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();

      console.log("ステージクリック - 選択中:", selectedGif.name, "位置:", pointer);

      // 新しいスタンプを追加
      const newStamp = {
        id: Date.now(),
        src: selectedGif.src,
        name: selectedGif.name,
        x: pointer.x - 50, // 画像の中心に配置するため50pxずらす
        y: pointer.y - 50,
        width: 100,
        height: 100,
      };

      console.log("新しいスタンプ追加:", newStamp);
      setStamps(prev => {
        console.log("現在のスタンプ数:", prev.length + 1);
        return [...prev, newStamp];
      });
    } else {
      // 描画機能はそのまま動作させる
      handleDown(e);
    }
  };

  // ドラッグオーバーハンドラー（不要になったが互換性のため残す）
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ドロップハンドラー（不要になったが互換性のため残す）
  const handleDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div className="frame-container">
      {/* 使用方法の説明 */}
      <div style={{
        backgroundColor: "#f0f0f0",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        fontSize: "14px",
        color: "#666"
      }}>
        <strong>使い方:</strong> アニメーションGIFを選択してから、ステージ上の任意の位置をクリックして配置してください。<br/>
        {selectedGif && <span style={{ color: "#ff6b6b" }}>選択中: {selectedGif.name}</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        {gifs.map((gif, index) => (
          <img
            key={index}
            src={gif.src}
            alt={`gif-${index}`}
            style={{
              width: "100px",
              height: "100px",
              margin: "5px",
              cursor: selectedGif?.name === gif.name ? "pointer" : "grab",
              border: selectedGif?.name === gif.name ? "3px solid #ff6b6b" : "2px solid #ccc",
              borderRadius: "8px",
              opacity: selectedGif?.name === gif.name ? 1 : 0.8
            }}
            onClick={() => handleGifSelect(gif)}
          />
        ))}
      </div>

      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleStageClick}
        onMouseMove={handleMove}
        onMouseUp={endDrawing}
        onTouchStart={handleStageClick}
        onTouchMove={handleMove}
        onTouchEnd={endDrawing}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ cursor: selectedGif ? "crosshair" : "default" }}
      >
        {/* 背景画像 */}
        <Layer>
          <URLImage src={image2} stageWidth={stageSize.width} stageHeight={stageSize.height} />
        </Layer>

        {/* スタンプレイヤー */}
        <Layer>
          {stamps.map((stamp) => (
            <StampImage
              key={stamp.id}
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

export default FrameMotionScreen;
