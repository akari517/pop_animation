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
  { src: book_flip, name: "book_flip", label: "本" },
  { src: tree_wind, name: "tree_wind", label: "木" },
  { src: pointer, name: "pointer", label: "ポインター" },
  { src: heart_pulse, name: "heart_pulse", label: "ハート" },
  { src: star, name: "star", label: "星" },
];

function FrameMotionScreen() {
  const stageSize = useStageSize();
  const [stamps, setStamps] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);
  const [selectedStampId, setSelectedStampId] = useState(null);

  const { handleDown, handleMove, endDrawing } = useDrawing([], "#0ff", "pen");

  // GIF選択ハンドラー
  const handleGifSelect = useCallback((gif) => {
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

    setStamps(prev => [...prev, newStamp]);
  }, []);

  // スタンプ選択トグル
  const toggleStampSelection = useCallback((id) => {
    setSelectedStampId(prev => (prev === id ? null : id));
  }, []);

  // ステージクリックハンドラー
  const handleStageClick = useCallback((e) => {
    if (selectedGif) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      addStamp(selectedGif, pointer);
      setSelectedGif(null);
      return;
    }

    setSelectedStampId(null);
    handleDown(e);
  }, [selectedGif, addStamp, handleDown]);

  // Undo: 最後に追加したスタンプを削除
  const undoLastStamp = useCallback(() => {
    setStamps(prev => (prev.length > 0 ? prev.slice(0, -1) : prev));
    setSelectedStampId(null);
  }, []);

  // 全削除
  const clearAllStamps = useCallback(() => {
    setStamps([]);
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      }}>
        {/* ヘッダー */}
        <Header />

        {/* GIF選択パネル */}
        <GifSelectionPanel
          gifs={GIF_ASSETS}
          selectedGif={selectedGif}
          onGifSelect={handleGifSelect}
          onUndo={undoLastStamp}
          onClear={clearAllStamps}
          canUndo={stamps.length > 0}
        />

        {/* キャンバス */}
        <div style={{
          marginTop: "20px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "3px solid #e0e0e0",
        }}>
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
            style={{ 
              cursor: selectedGif ? "crosshair" : "default",
              display: "block",
            }}
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

        {/* ステータスバー */}
        <StatusBar stampCount={stamps.length} />
      </div>
    </div>
  );
}

// ヘッダーコンポーネント
function Header() {
  return (
    <div style={{
      marginBottom: "20px",
      textAlign: "center",
    }}>
      <h1 style={{
        fontSize: "32px",
        fontWeight: "700",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        margin: "0 0 8px 0",
      }}>
        スタンプ画面
      </h1>
      <p style={{
        fontSize: "14px",
        color: "#666",
        margin: 0,
      }}>
        お気に入りのGIFスタンプを選んで、画像をデコレーションしよう！
      </p>
    </div>
  );
}


// GIF選択パネルコンポーネント
function GifSelectionPanel({ gifs, selectedGif, onGifSelect, onUndo, onClear, canUndo }) {
  return (
    <div style={{
      background: "#f8f9fa",
      padding: "20px",
      borderRadius: "12px",
      border: "2px solid #e9ecef",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        {/* GIFサムネイル */}
        <div style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}>
          {gifs.map((gif) => (
            <GifThumbnail
              key={gif.name}
              gif={gif}
              isSelected={selectedGif?.name === gif.name}
              onSelect={onGifSelect}
            />
          ))}
        </div>

        {/* コントロールボタン */}
        <div style={{
          display: "flex",
          gap: "10px",
        }}>
          <ActionButton
            onClick={onUndo}
            disabled={!canUndo}
            icon="↶"
            label="元に戻す"
            hotkey="Ctrl+Z"
          />
          <ActionButton
            onClick={onClear}
            disabled={!canUndo}
            icon="🗑️"
            label="全削除"
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
}

// GIFサムネイルコンポーネント
function GifThumbnail({ gif, isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(gif)}
      style={{
        position: "relative",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: isSelected ? "scale(1.05)" : "scale(1)",
      }}
    >
      <div style={{
        width: "90px",
        height: "90px",
        borderRadius: "12px",
        overflow: "hidden",
        border: isSelected ? "3px solid #667eea" : "3px solid #dee2e6",
        boxShadow: isSelected 
          ? "0 8px 24px rgba(102, 126, 234, 0.4)"
          : "0 2px 8px rgba(0, 0, 0, 0.1)",
        background: "#fff",
        transition: "all 0.2s ease",
      }}>
        <img
          src={gif.src}
          alt={gif.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <div style={{
        marginTop: "6px",
        textAlign: "center",
        fontSize: "12px",
        fontWeight: isSelected ? "600" : "500",
        color: isSelected ? "#667eea" : "#495057",
      }}>
        {gif.label}
      </div>
    </div>
  );
}

// アクションボタンコンポーネント
function ActionButton({ onClick, disabled, icon, label, hotkey, variant = "primary" }) {
  const colors = {
    primary: {
      bg: "#667eea",
      bgHover: "#5568d3",
      bgDisabled: "#cbd5e0",
    },
    danger: {
      bg: "#f56565",
      bgHover: "#e53e3e",
      bgDisabled: "#cbd5e0",
    },
  };

  const color = colors[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? color.bgDisabled : color.bg,
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        boxShadow: disabled ? "none" : "0 2px 8px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.background = color.bgHover;
          e.target.style.transform = "translateY(-1px)";
          e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.background = color.bg;
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
        }
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span>{label}</span>
      {hotkey && !disabled && (
        <span style={{
          fontSize: "11px",
          opacity: 0.8,
          marginLeft: "4px",
        }}>
          ({hotkey})
        </span>
      )}
    </button>
  );
}

// ステータスバーコンポーネント
function StatusBar({ stampCount }) {
  return (
    <div style={{
      marginTop: "16px",
      padding: "12px 16px",
      background: "#f8f9fa",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "13px",
      color: "#6c757d",
    }}>
      {/* <div>
        📍 配置済みスタンプ: <strong style={{ color: "#495057" }}>{stampCount}個</strong>
      </div>
      <div style={{ opacity: 0.7 }}>
        💾 自動保存機能は未実装です
      </div> */}
    </div>
  );
}

export default FrameMotionScreen;