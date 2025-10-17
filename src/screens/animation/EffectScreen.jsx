// src/components/MyPageScreen.jsx
import React, { useContext } from "react";
import { AnimationContext } from "../../context/AnimationContext";
import './Effects/EffectScreen.css';
import { effects, OverlayEffects, OverlayThumbnail } from './Effects/EffectItems';

function EffectScreen() {
  const { activeEffect, setActiveEffect, selectedImage } = useContext(AnimationContext);
  const currentFilter = effects.find(effect => effect.id === activeEffect)?.filter || 'none';
  return (
    <div className="app-container" style={{ paddingBottom: 90 }}>
      <main className="image-viewport">
        {selectedImage ? (
          <div className="image-wrapper">
            <img
              src={selectedImage}
              alt="選択された画像"
              className="main-image"
              style={{ filter: currentFilter, maxWidth: '100%', maxHeight: '100%' }}
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
              selectedImage ? (
                <img src={selectedImage} alt={effect.name} style={{ filter: effect.filter }} />
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