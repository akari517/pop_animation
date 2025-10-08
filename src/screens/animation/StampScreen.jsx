import React, { useState, useEffect, useCallback } from "react";
import { Stage, Layer } from "react-konva";
import "./FrameMotionScreen.css";
import image2 from "../../assets/image4.jpg";
import URLImage from "../../components/URLImage.jsx";
import StampImage from "../../components/StampImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";
import { useDrawing } from "../../components/useDrawing";

// GIF assets
import book_flip from "../../assets/book_flip.gif";
import tree_wind from "../../assets/tree_wind.gif";
import star from "../../assets/star.gif";
import heart_pulse from "../../assets/heart_pulse.gif";
import pointer from "../../assets/pointer.gif";

// 定数
const STAMP_DEFAULT_SIZE = 100;
const GIF_ASSETS = [
  { src: book_flip, name: "book_flip" },
  { src: tree_wind, name: "tree_wind" },
  { src: pointer, name: "pointer" },
  { src: heart_pulse, name: "heart_pulse" },
  { src: star, name: "star" },
];

function FrameMotionScreen() {
  const stageSize = useStageSize();
  const [stamps, setStamps] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);
  const [selectedStampId, setSelectedStampId] = useState(null);

  const { handleDown, handleMove, endDrawing } = useDrawing([], "#0ff", "pen");

  // GIF選択ハンドラー
  const handleGifSelect = useCallback((gif) => {
    console.log("GIF選択:", gif.name);
    setSelectedGif(gif);
    setSelectedStampId(null);
  }, []);

  // スタンプ追加
  const addStamp = useCallback((gif, position) => {
    const newStamp = {
      id: Date.now(),
      src: gif.src,
      name: gif.name,
      x: position.x - STAMP_DEFAULT_SIZE / 2,
      y: position.y - STAMP_DEFAULT_SIZE / 2,
      width: STAMP_DEFAULT_SIZE,
      height: STAMP_DEFAULT_SIZE,
    };

    console.log("新しいスタンプ追加:", newStamp);
    setStamps(prev => [...prev, newStamp]);
  }, []);

  // スタンプ選択トグル
  const toggleStampSelection = useCallback((id) => {
    setSelectedStampId(prev => (prev === id ? null : id));
  }, []);

  // ステージクリックハンドラー
  const handleStageClick = useCallback((e) => {
    // GIF選択中の場合、スタンプを配置
    if (selectedGif) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();

      console.log("ステージクリック - 選択中:", selectedGif.name, "位置:", pointer);

      addStamp(selectedGif, pointer);
      setSelectedGif(null); // 配置後は選択解除
      return;
    }

    // 空のステージをクリック → スタンプ選択解除
    setSelectedStampId(null);

    // 通常の描画処理
    handleDown(e);
  }, [selectedGif, addStamp, handleDown]);

  // Undo: 最後に追加したスタンプを削除
  const undoLastStamp = useCallback(() => {
    setStamps(prev => (prev.length > 0 ? prev.slice(0, -1) : prev));
    setSelectedStampId(null);
  }, []);

  // キーボードショートカット (Ctrl/Cmd + Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isUndo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z";
      if (isUndo) {
        e.preventDefault();
        undoLastStamp();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoLastStamp]);

  return (
    <div className="frame-container">
      {/* 使用方法の説明 */}
      <InstructionBanner />

      {/* GIF選択パネル */}
      <GifSelectionPanel
        gifs={GIF_ASSETS}
        selectedGif={selectedGif}
        onGifSelect={handleGifSelect}
        onUndo={undoLastStamp}
        canUndo={stamps.length > 0}
      />

      {/* キャンバス */}
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
        {/* 背景画像レイヤー */}
        <Layer>
          <URLImage
            src={image2}
            stageWidth={stageSize.width}
            stageHeight={stageSize.height}
          />
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
              onSelect={toggleStampSelection}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

// 使用方法バナーコンポーネント
function InstructionBanner() {
  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        fontSize: "14px",
        color: "#666",
      }}
    >
      <strong>使い方:</strong> アニメーションGIFを選択してから、ステージ上の任意の位置をクリックして配置してください。
    </div>
  );
}

// GIF選択パネルコンポーネント
function GifSelectionPanel({ gifs, selectedGif, onGifSelect, onUndo, canUndo }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      {gifs.map((gif) => (
        <GifThumbnail
          key={gif.name}
          gif={gif}
          isSelected={selectedGif?.name === gif.name}
          onSelect={onGifSelect}
        />
      ))}

      <UndoButton onClick={onUndo} disabled={!canUndo} />
    </div>
  );
}

// GIFサムネイルコンポーネント
function GifThumbnail({ gif, isSelected, onSelect }) {
  return (
    <img
      src={gif.src}
      alt={gif.name}
      style={{
        width: "100px",
        height: "100px",
        margin: "5px",
        cursor: isSelected ? "pointer" : "grab",
        border: isSelected ? "3px solid #ff6b6b" : "2px solid #ccc",
        borderRadius: "8px",
        opacity: isSelected ? 1 : 0.8,
      }}
      onClick={() => onSelect(gif)}
    />
  );
}

// Undoボタンコンポーネント
function UndoButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        marginLeft: 12,
        padding: "8px 12px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      Undo
    </button>
  );
}

export default FrameMotionScreen;