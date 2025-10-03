// src/components/MyPageScreen.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import './EffectScreen.css';
import { effects, OverlayEffects, OverlayThumbnail } from './EffectItems';

function EffectScreen() {
  const [activeEffect, setActiveEffect] = useState('none');
  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const currentFilter =
    effects.find(effect => effect.id === activeEffect)?.filter || 'none';

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
      setImageSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div className="app-container">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      <header className="top-nav">
        <button className="select-button" onClick={() => fileInputRef.current.click()}>
          写真を選ぶ
        </button>
        <button className="done-button">編集完了</button>
      </header>

      <main className="image-viewport">
        {imageSrc ? (
          <div className="image-wrapper">
            <img
              src={imageSrc}
              alt="Editable"
              className="main-image"
              style={{ filter: currentFilter }}
            />
            {activeEffect !== 'none' && OverlayEffects[activeEffect]?.()}
          </div>
        ) : (
          <div className="placeholder-text">画像が選択されていません</div>
        )}
      </main>

      <section className="effects-carousel">
        {effects.map((effect) => (
          <div
            key={effect.id}
            onClick={() => setActiveEffect(effect.id)}
            className={`effect-thumbnail ${effect.id === activeEffect ? 'active' : ''}`}
          >
            {effect.type === 'filter' ? (
              imageSrc ? (
                <img src={imageSrc} alt={effect.name} style={{ filter: effect.filter }} />
              ) : (
                <div className="thumbnail-placeholder">{effect.name}</div>
              )
            ) : (
              <div className="thumbnail-overlay">
                <div className="sample-bg"></div>
                {OverlayThumbnail[effect.id]?.()}
              </div>
            )}
            <span>{effect.name}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default EffectScreen;