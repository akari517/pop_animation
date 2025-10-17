import React from "react";
import frame01 from "./frame-01.png";
import frame02 from "./frame-02.png";

// フレーム一覧
export const frames = [
  { id: "none", name: "なし" },
  { id: "simple", name: "シンプル枠" },
  { id: "flower", name: "花柄" },
  { id: "frame01", name: "額縁" },
  { id: "frame02", name: "額縁2" },
];

// フレームの本体 (画像に重ねる要素)
export const FrameOverlay = {
  simple: ({ color = "#ffffff" }) => (
    <div className="frame-overlay simple-frame" style={{ borderColor: color }}></div>
  ),
  flower: () => <div className="frame-overlay flower-frame"></div>,
  frame01: () => (
    <img
      src={frame01}
      alt="額縁フレーム"
      className="frame-overlay image-frame"
    />
  ),
  frame02: () => (
    <img
      src={frame02}
      alt="額縁フレーム"
      className="frame-overlay image-frame2"
    />
  ),
};

// サムネイル用
export const FrameThumbnail = {
  simple: () => <div className="thumb-overlay simple-frame"></div>,
  flower: () => <div className="thumb-overlay flower-frame"></div>,
  frame01: () => (
    <img
      src={frame01}
      alt="額縁サムネイル"
      className="thumb-overlay image-frame-thumb"
    />
  ),
  frame02: () => (
    <img
      src={frame02}
      alt="額縁サムネイル"
      className="thumb-overlay image-frame-thumb2"
    />
  ),
};
