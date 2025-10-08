import React, { useState } from "react";
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
  const [selectedStampId, setSelectedStampId] = useState(null);

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


  // GIF選択ハンドラー
  const handleGifSelect = (gif) => {
    console.log("GIF選択:", gif.name);
    setSelectedGif(gif);
    setSelectedStampId(null);
  };

  // ステージクリックハンドラー
  const handleStageClick = (e) => {
    if (selectedGif) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();

      console.log("ステージクリック - 選択中:", selectedGif.name, "位置:", pointer);

      const newStamp = {
        id: Date.now(),
        src: selectedGif.src,
        name: selectedGif.name,
        x: pointer.x - 50,
        y: pointer.y - 50,
        width: 100,
        height: 100,
      };

      console.log("新しいスタンプ追加:", newStamp);
      setStamps(prev => [...prev, newStamp]);

      // 追加したらGIF選択を解除（意図通り選択解除）
      setSelectedGif(null);
      return;
    }

    // Clicking empty stage -> deselect any selected stamp
    setSelectedStampId(null);

    // 通常の描画処理
    handleDown(e);
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
        {/* {selectedGif && <span style={{ color: "#ff6b6b" }}>選択中: {selectedGif.name}</span>} */}
      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
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
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
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
              id={stamp.id}
              src={stamp.src}
              x={stamp.x}
              y={stamp.y}
              width={stamp.width}
              height={stamp.height}
              isSelected={selectedStampId === stamp.id}
              onSelect={(id) => {
                // toggle selection
                setSelectedStampId(prev => (prev === id ? null : id));
              }}
            />
          ))}
        </Layer>

      </Stage>
    </div>
  );
}

export default FrameMotionScreen;
