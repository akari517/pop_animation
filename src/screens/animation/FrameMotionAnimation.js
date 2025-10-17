export const FrameMotionAnimation = {
  
  // 上下に弾むだけ
  bounce: (tick, idx) => {
    const scale = 1 + Math.sin(tick / 5 + idx) * 0.4;
    const offsetY = Math.sin(tick / 5 + idx) * 10; 
    return { scaleX: 0, scaleY: 0, y: offsetY, x: 0 };
  },

  // 横に波打つだけ
  wave: (tick, idx) => {
    const offsetX = Math.sin(tick / 4 + idx) * 30; // X方向だけ
    return { x: offsetX, y: 0 };
  },

  // 拡大縮小だけ
  pulse: (tick, idx) => {
    const scale = 1 + Math.sin(tick / 10 + idx) * 0.2;
    return { scaleX: scale, scaleY: scale, x: 0, y: 0 };
  },

  // 回転だけ
  rotate: (tick, idx) => {
    const rotation = (tick * 5) % 360;
    return { rotation, x: 0, y: 0 };
  },

  // 小刻みに左右だけ
  shake: (tick, idx) => {
    const x = Math.sin(tick * 30 + idx) * 8;
    return { x, y: 0 };
  },

  // ドアの回転だけ
  doorDouble: (tick, idx, width = 200) => {
    const progress = Math.sin(tick / 10);
    const isLeft = idx % 2 === 0;
    const angle = progress * 60 * (isLeft ? 1 : -1);
    const offsetX = isLeft ? 0 : width;
    const x = isLeft ? 0 : width;
    return { rotation: angle, offsetX, x, y: 0 };
  },
};



// 共通取得関数
export const getAnimProps = (activeAnimation, tick, idx, width) => {
  const anim = FrameMotionAnimation[activeAnimation];
  return anim ? anim(tick, idx, width) : {};
};

// ボタン用リスト
export const animationList = Object.keys(FrameMotionAnimation).map(key => ({
  key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
}));
