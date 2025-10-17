import { useState, useRef, useEffect, useContext } from "react";
import "./Frames/FrameScreen.css";
import { frames, FrameOverlay, FrameThumbnail } from "./Frames/FrameItems";
import { AnimationContext } from "../../context/AnimationContext";

function FrameScreen() {
  const { activeFrame, setActiveFrame, selectedImage, setSelectedImageFromFile, simpleFrameColor, setSimpleFrameColor } = useContext(AnimationContext);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleImageLoad = (e) => {
    setImageSize({ width: e.target.naturalWidth, height: e.target.naturalHeight });
  };

  const handleFrameClick = (frameId) => {
    if (frameId === "simple") {
      if (activeFrame === "simple") {
        setShowColorPicker(!showColorPicker);
      } else {
        setActiveFrame(frameId);
        setShowColorPicker(true);
      }
    } else {
      setActiveFrame(frameId);
      setShowColorPicker(false);
    }
  };

  return (
    <div className="app-container" style={{ paddingBottom: 90 }}>
      {/* 親の AnimationHomeScreen で画像選択を行うため、input と header は削除 */}

      <main className="image-viewport">
        {selectedImage ? (
          <div
            className="image-wrapper"
            style={{ width: imageSize.width, height: imageSize.height }}
            mr-100="true"
          >
            <img
              src={selectedImage}
              alt="選択された画像"
              className="main-image"
              onLoad={handleImageLoad}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            {/* フレーム表示 */}
            {activeFrame === "simple"
              ? FrameOverlay.simple({ color: simpleFrameColor })
              : activeFrame !== "none" &&
              FrameOverlay[activeFrame]?.({ width: imageSize.width, height: imageSize.height })}

            {/* 色選択 */}
            {showColorPicker && activeFrame === "simple" && (
              <div className="color-picker-container">
                <span className="color-picker-emoji">🎨</span>
                <input
                  type="color"
                  value={simpleFrameColor}
                  onChange={(e) => setSimpleFrameColor(e.target.value)}
                  className="color-picker"
                />
              </div>
            )}

          </div>
        ) : (
          <div className="placeholder-text">画像が選択されていません</div>
        )}
      </main>

      <section className="effects-carousel">
        {frames.map((frame) => (
          <div
            key={frame.id}
            onClick={() => handleFrameClick(frame.id)}
            className={`effect-thumbnail ${frame.id === activeFrame ? "active" : ""}`}
          >
            {selectedImage ? (
              <div className="thumbnail-wrapper">
                <img src={selectedImage} alt={frame.name} />
                {FrameThumbnail[frame.id]?.()}
              </div>
            ) : (
              <div className="thumbnail-placeholder">{frame.name}</div>
            )}
            <span>{frame.name}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default FrameScreen;
