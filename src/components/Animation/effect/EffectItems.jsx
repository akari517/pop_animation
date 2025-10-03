import React from 'react';
import './EffectItems.css';

// ------------------------
// エフェクト定義（静的 + 動的）
export const effects = [
  // 静的エフェクト（フィルター）
  { id: 'none', name: 'なし', type: 'filter', filter: 'none' },
  { id: 'sepia', name: 'セピア', type: 'filter', filter: 'sepia(100%)' },
  { id: 'grayscale', name: '白黒', type: 'filter', filter: 'grayscale(100%)' },
  { id: 'saturate', name: '高彩度', type: 'filter', filter: 'saturate(2)' },
  { id: 'hue-rotate', name: '色相回転', type: 'filter', filter: 'hue-rotate(90deg)' },
  { id: 'invert', name: '階調反転', type: 'filter', filter: 'invert(100%)' },
  { id: 'brightness', name: '明るく', type: 'filter', filter: 'brightness(1.5)' },
  { id: 'contrast', name: 'コントラスト', type: 'filter', filter: 'contrast(2)' },
  { id: 'blur', name: 'ぼかし', type: 'filter', filter: 'blur(4px)' },

  // 動的エフェクト（オーバーレイ）
  { id: 'light', name: '光', type: 'overlay' },
  { id: 'rain', name: '雨', type: 'overlay' },
  { id: 'sparkle', name: 'キラキラ', type: 'overlay' },
  { id: 'snow', name: '雪', type: 'overlay' },
];

// ------------------------
// メイン画像用オーバーレイ
export const OverlayEffects = {
  light: () => <div className="light-overlay"></div>,
  rain: () => <div className="rain-overlay"></div>,
  sparkle: () => {
    const sparkles = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 2}px`,
      duration: `${1 + Math.random() * 3}s`,
    }));
    return (
      <div className="sparkle-overlay">
        {sparkles.map((p, i) => (
          <span
            key={i}
            className="sparkle"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
    );
  },
  snow: () => {
    const snowflakes = Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 2}px`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    return (
      <div className="snow-overlay">
        {snowflakes.map((p, i) => (
          <span
            key={i}
            className="snowflake"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
    );
  },
};

// ------------------------
// サムネイル用オーバーレイ
export const OverlayThumbnail = {
  light: () => <div className="light-overlay-small"></div>,
  rain: () => <div className="rain-overlay-small"></div>,
  sparkle: () => (
    <div className="sparkle-overlay-small">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="sparkle-sample" style={{ "--i": i }} />
      ))}
    </div>
  ),
  snow: () => (
    <div className="snow-overlay-small">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="snowflake-sample" style={{ "--i": i }} />
      ))}
    </div>
  ),
};
