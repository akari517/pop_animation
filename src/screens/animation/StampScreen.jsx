// StampScreen.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Stage, Layer } from "react-konva";
import URLImage from "../../components/URLImage.jsx";
import StampImage from "../../components/StampImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";
import { useDrawing } from "../../components/useDrawing.jsx";
import { AnimationContext } from "../../context/AnimationContext";

// GIF assets
import book_flip from "../../assets/book_flip.gif";
import tree_wind from "../../assets/tree_wind.gif";
import star from "../../assets/star.gif";
import heart_pulse from "../../assets/heart_pulse.gif";
import pointer from "../../assets/pointer.gif";

const STAMP_DEFAULT_SIZE = 100;
const GIF_ASSETS = [
  { src: book_flip, name: "book_flip", label: "本" },
  { src: tree_wind, name: "tree_wind", label: "木" },
  { src: pointer, name: "pointer", label: "ポインター" },
  { src: heart_pulse, name: "heart_pulse", label: "ハート" },
  { src: star, name: "star", label: "星" },
];

function StampScreen() {
  const stageSize = useStageSize(70);
  // AnimationContextからstamps, setStamps, selectedImageを取得
  const { stamps, setStamps, selectedImage } = useContext(AnimationContext);

  // --- GIF選択 ---
  const [selectedGif, setSelectedGif] = useState(null);
  const [selectedStampId, setSelectedStampId] = useState(null);

  // --- GIF選択 ---
  const handleGifSelect = useCallback((gif) => {
    setSelectedGif(gif);
    setSelectedStampId(null);
  }, []);

  // --- スタンプ追加 ---
  const handleAddStamp = useCallback((gif, position) => {
    const newStamp = {
      id: Date.now() + "_" + Math.random(),
      src: gif.src,
      name: gif.name,
      x: position.x - STAMP_DEFAULT_SIZE / 2,
      y: position.y - STAMP_DEFAULT_SIZE / 2,
      width: STAMP_DEFAULT_SIZE,
      height: STAMP_DEFAULT_SIZE,
    };
    // スタンプ追加
    setStamps(prev => [...prev, newStamp]);
    setSelectedGif(null);
  }, [setStamps]);

  // --- ステージクリック ---
  const handleStageClick = useCallback((e) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (selectedGif) {
      handleAddStamp(selectedGif, pointer);
      return;
    }
    setSelectedStampId(null);
  }, [selectedGif, handleAddStamp]);

  // --- Undo ---
  const handleUndoStamp = useCallback(() => {
    setStamps(prev => (prev.length > 0 ? prev.slice(0, -1) : prev));
    setSelectedStampId(null);
  }, [setStamps]);

  // --- Clear ---
  const handleClearStamps = useCallback(() => {
    setStamps([]);
    setSelectedStampId(null);
  }, [setStamps]);

  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", background: "rgba(255,255,255,0.95)", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <Header />
        <GifSelectionPanel
          gifs={GIF_ASSETS}
          selectedGif={selectedGif}
          onGifSelect={handleGifSelect}
          onUndo={handleUndoStamp}
          onClear={handleClearStamps}
          canUndo={stamps.length > 0}
        />
        <div style={{ marginTop: "20px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "3px solid #e0e0e0" }}>
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleStageClick}
            onTouchStart={handleStageClick}
            style={{ cursor: selectedGif ? "crosshair" : "default", display: "block" }}
          >
            <Layer>
              <URLImage src={selectedImage || undefined} stageWidth={stageSize.width} stageHeight={stageSize.height} />
            </Layer>
            <Layer>
              {stamps.map(stamp => (
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
        <StatusBar stampCount={stamps.length} />
      </div>
    </div>
  );
}

// ------------------- ヘッダー・パネル・ボタン -------------------
function Header() {
  return (
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "700", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px 0" }}>
        スタンプ画面
      </h1>
      <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
        お気に入りのGIFスタンプを選んで、画像をデコレーションしよう！
      </p>
    </div>
  );
}

function GifSelectionPanel({ gifs, selectedGif, onGifSelect, onUndo, onClear, canUndo }) {
  return (
    <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "12px", border: "2px solid #e9ecef" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {gifs.map(gif => (
            <GifThumbnail key={gif.name} gif={gif} isSelected={selectedGif?.name === gif.name} onSelect={onGifSelect} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <ActionButton onClick={onUndo} disabled={!canUndo} icon="↶" label="元に戻す" hotkey="Ctrl+Z" />
          <ActionButton onClick={onClear} disabled={!canUndo} icon="🗑️" label="全削除" variant="danger" />
        </div>
      </div>
    </div>
  );
}

function GifThumbnail({ gif, isSelected, onSelect }) {
  return (
    <div onClick={() => onSelect(gif)} style={{ position: "relative", cursor: "pointer", transition: "all 0.2s ease", transform: isSelected ? "scale(1.05)" : "scale(1)" }}>
      <div style={{ width: "90px", height: "90px", borderRadius: "12px", overflow: "hidden", border: isSelected ? "3px solid #667eea" : "3px solid #dee2e6", boxShadow: isSelected ? "0 8px 24px rgba(102,126,234,0.4)" : "0 2px 8px rgba(0,0,0,0.1)", background: "#fff", transition: "all 0.2s ease" }}>
        <img src={gif.src} alt={gif.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: "6px", textAlign: "center", fontSize: "12px", fontWeight: isSelected ? "600" : "500", color: isSelected ? "#667eea" : "#495057" }}>
        {gif.label}
      </div>
    </div>
  );
}

function ActionButton({ onClick, disabled, icon, label, hotkey, variant = "primary" }) {
  const colors = { primary: { bg: "#667eea", bgHover: "#5568d3", bgDisabled: "#cbd5e0" }, danger: { bg: "#f56565", bgHover: "#e53e3e", bgDisabled: "#cbd5e0" } };
  const color = colors[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ background: disabled ? color.bgDisabled : color.bg, color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "8px", }}
      onMouseEnter={e => { if (!disabled) { e.target.style.background = color.bgHover; e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; } }}
      onMouseLeave={e => { if (!disabled) { e.target.style.background = color.bg; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)"; } }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span>{label}</span>
      {hotkey && !disabled && <span style={{ fontSize: "11px", opacity: 0.8, marginLeft: "4px" }}>({hotkey})</span>}
    </button>
  );
}

function StatusBar({ stampCount }) {
  return <div style={{ marginTop: "16px", padding: "12px 16px", background: "#f8f9fa", borderRadius: "8px", fontSize: "13px", color: "#6c757d" }}>スタンプ数: {stampCount}</div>;
}
export default StampScreen;
