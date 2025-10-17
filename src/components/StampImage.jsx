import React, { useEffect, useRef, useCallback } from "react";
import { Group, Image as KonvaImage } from "react-konva";

/**
 * アニメーションGIFをKonvaステージ上に表示するコンポーネント
 * 
 * DOM imgエレメントを使用してGIFアニメーションを再生し、
 * Konvaのグループと同期させて位置・スケール・回転を反映します
 */
const StampImage = ({ id, src, x, y, width, height, ...rest }) => {
  const groupRef = useRef(null);
  const domImgRef = useRef(null);

  /**
   * ステージコンテナを相対配置に設定
   * 絶対配置される子要素が正しく配置されるために必要
   */
  const ensureContainerPositioned = useCallback((container) => {
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
  }, []);

  /**
   * DOM img要素を作成または取得
   */
  const getOrCreateDomImage = useCallback((container) => {
    let img = domImgRef.current;
    
    if (!img) {
      img = document.createElement("img");
      domImgRef.current = img;
      
      // 基本スタイル設定
      Object.assign(img.style, {
        position: "absolute",
        pointerEvents: "none", // Konvaへのイベント通過を許可
        transformOrigin: "top left",
      });
      
      container.appendChild(img);
    }
    
    return img;
  }, []);

  /**
   * DOM img要素の初期スタイルを設定
   */
  const applyInitialImageStyles = useCallback((img, stage) => {
    img.src = src;
    img.style.width = `${width * stage.scaleX()}px`;
    img.style.height = `${height * stage.scaleY()}px`;
    img.style.opacity = rest.opacity ?? "1";
  }, [src, width, height, rest.opacity]);

  /**
   * Konvaノードの位置・スケール・回転をDOM imgに反映
   */
  const syncDomImagePosition = useCallback((group, img, stage) => {
    const absPos = group.getAbsolutePosition();
    const scale = stage.scaleX(); // 均一スケールを想定
    const rotation = group.getAbsoluteRotation ? group.getAbsoluteRotation() : 0;

    // 位置とサイズの更新
    Object.assign(img.style, {
      left: `${absPos.x * scale}px`,
      top: `${absPos.y * scale}px`,
      width: `${width * scale}px`,
      height: `${height * scale}px`,
    });

    // 回転の反映
    img.style.transform = rotation 
      ? `rotate(${rotation}deg) scale(${scale})` 
      : `scale(${scale})`;
  }, [width, height]);

  /**
   * イベントリスナーの登録
   */
  const setupEventListeners = useCallback((layer, stage, updateFn) => {
    layer.on("draw", updateFn);
    stage.on("scaleX change:scaleX scaleY change:scaleY", updateFn);
    window.addEventListener("resize", updateFn);

    return () => {
      layer.off("draw", updateFn);
      stage.off("scaleX change:scaleX scaleY change:scaleY", updateFn);
      window.removeEventListener("resize", updateFn);
    };
  }, []);

  /**
   * DOM img要素のクリーンアップ
   */
  const cleanupDomImage = useCallback(() => {
    const img = domImgRef.current;
    if (img?.parentNode) {
      img.parentNode.removeChild(img);
    }
    domImgRef.current = null;
  }, []);

  // メインエフェクト: DOM img要素の作成と同期
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const stage = group.getStage();
    if (!stage) return;

    const container = stage.container();
    ensureContainerPositioned(container);

    const img = getOrCreateDomImage(container);
    applyInitialImageStyles(img, stage);

    // 位置更新関数
    const updatePosition = () => {
      syncDomImagePosition(group, img, stage);
    };

    // 初期位置設定
    updatePosition();

    // イベントリスナー登録とクリーンアップ
    const layer = group.getLayer();
    const cleanup = setupEventListeners(layer, stage, updatePosition);

    return () => {
      cleanup();
      cleanupDomImage();
    };
  }, [
    id,
    src,
    x,
    y,
    width,
    height,
    rest.opacity,
    ensureContainerPositioned,
    getOrCreateDomImage,
    applyInitialImageStyles,
    syncDomImagePosition,
    setupEventListeners,
    cleanupDomImage,
  ]);

  // Konva Group: 位置・回転情報を保持
  // 不可視のKonva Imageでレイヤー順序を維持
  return (
    <Group ref={groupRef} x={x} y={y}>
      <KonvaImage
        x={0}
        y={0}
        width={width}
        height={height}
        listening={false}
        visible={false}
        {...rest}
      />
    </Group>
  );
};

export default StampImage;