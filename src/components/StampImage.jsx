import React, { useEffect, useRef } from "react";
import { Group, Rect, Image as KonvaImage } from "react-konva";

// アニメーションGIFを表示するコンポーネント
const StampImage = ({ id, src, x, y, width, height, isSelected, onSelect, ...rest }) => {
  const nodeRef = useRef(null); // will be attached to Group
  const domImgRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const stage = node.getStage();
    if (!stage) return;

    // stage container must be positioned so absolute children align
    const container = stage.container();
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    // create DOM img element (or reuse)
    let img = domImgRef.current;
    if (!img) {
      img = document.createElement("img");
      domImgRef.current = img;
      img.style.position = "absolute";
      img.style.pointerEvents = "none"; // let events pass through to konva
      img.style.transformOrigin = "top left";
      container.appendChild(img);
    }

    img.src = src;
    img.style.width = `${width * stage.scaleX()}px`;
    img.style.height = `${height * stage.scaleY()}px`;
    img.style.opacity = rest.opacity ?? "1";

    const updatePosition = () => {
      // get absolute position of the Konva node (group), then convert to DOM coords
      const absPos = node.getAbsolutePosition();
      const scale = stage.scaleX(); // assume uniform scale
      const left = absPos.x * scale;
      const top = absPos.y * scale;
      img.style.left = `${left}px`;
      img.style.top = `${top}px`;
      img.style.width = `${width * scale}px`;
      img.style.height = `${height * scale}px`;
      // handle rotation if needed
      const rot = node.getAbsoluteRotation ? node.getAbsoluteRotation() : 0;
      if (rot) {
        img.style.transform = `rotate(${rot}deg) scale(${scale})`;
      } else {
        img.style.transform = `scale(${scale})`;
      }
    };

    // initial position
    updatePosition();

    const layer = node.getLayer();
    // update on layer draw / stage transforms / window resize
    layer.on("draw", updatePosition);
    stage.on("scaleX change:scaleX scaleY change:scaleY", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      // cleanup
      layer.off("draw", updatePosition);
      stage.off("scaleX change:scaleX scaleY change:scaleY", updatePosition);
      window.removeEventListener("resize", updatePosition);
      if (img && img.parentNode) {
        img.parentNode.removeChild(img);
      }
      domImgRef.current = null;
    };
  }, [id, src, x, y, width, height, rest, nodeRef]);

  // Konva Group used for position/rotation info; transparent Rect captures clicks
  return (
    <Group ref={nodeRef} x={x} y={y}>
      {/* invisible konva image placeholder (keeps layering) */}
      <KonvaImage
        x={0}
        y={0}
        width={width}
        height={height}
        listening={false}
        visible={false}
        {...rest}
      />
      {/* transparent rectangle to capture clicks / show selection outline */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={"rgba(0,0,0,0)"} // fully transparent to let DOM img be visible
        stroke={isSelected ? "#ff6b6b" : null}
        strokeWidth={isSelected ? 3 : 0}
        listening={true}
        onClick={(e) => {
          e.cancelBubble = true; // prevent Stage click handler
          if (onSelect) onSelect(id);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          if (onSelect) onSelect(id);
        }}
      />
    </Group>
  );
};

export default StampImage;