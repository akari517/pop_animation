import { useState, useRef, useEffect } from "react";
import "./Frames/FrameScreen.css";
import { frames, FrameOverlay, FrameThumbnail } from "./Frames/FrameItems";

function FrameScreen() {
  const [activeFrame, setActiveFrame] = useState("none");
  const [imageSrc, setImageSrc] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [simpleFrameColor, setSimpleFrameColor] = useState("#ff0000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (imageSrc && imageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc);
      }
      setImageSrc(URL.createObjectURL(file));
    }
  };

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
    <div className="app-container">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      <header className="top-nav">
        <button className="select-button" onClick={() => fileInputRef.current.click()}>
          写真を選ぶ
        </button>
        <button className="done-button">編集完了</button>
      </header>

      <main className="image-viewport">
        {imageSrc ? (
          //ふれーむ
          <div
            className="image-wrapper"
            style={{ width: imageSize.width, height: imageSize.height }}
            mr-100
          >
            <img
              src={imageSrc}
              alt="Editable"
              className="main-image"
              onLoad={handleImageLoad}
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
            {imageSrc ? (
              <div className="thumbnail-wrapper">
                <img src={imageSrc} alt={frame.name} />
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
