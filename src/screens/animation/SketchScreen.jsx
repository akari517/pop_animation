import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Circle, Image } from "react-konva";
import useImage from "use-image";
import Button from "../../components/button";
import image2 from "../../assets/image4.jpg";

const SketchScreen = () => {
  const isDrawing = useRef(false);
  const [tool, setTool] = useState("pen"); // "pen" | "eraser"
  const [color, setColor] = useState("#ffadad");
  const [shapes, setShapes] = useState([]);
  const history = useRef([[]]);
  const historyStep = useRef(0);

  // レスポンシブ対応
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 50 - 50 - 16, // 上ボタン50px, 下ボタン50px, 余白16px
  });

  // リサイズ対応
  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight * 0.8 - 50 - 50 - 16,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 描画操作
  const startDrawing = (pos) => {
    isDrawing.current = true;
    if (tool === "pen" || tool === "eraser") {
      setShapes((prev) => [...prev, { points: [pos.x, pos.y], color, tool }]);
    } 
  };

  const drawMove = (pos) => {
    if (!isDrawing.current) return;
    setShapes((prev) => {
      const lastIdx = prev.length - 1;
      const lastShape = prev[lastIdx];
      if (lastShape.tool === "pen" || lastShape.tool === "eraser") {
        return [
          ...prev.slice(0, lastIdx),
          { ...lastShape, points: [...lastShape.points, pos.x, pos.y] },
        ];
      } 
      return prev;
    });
  };

  const endDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const newHistory = history.current.slice(0, historyStep.current + 1);
    newHistory.push([...shapes]);
    history.current = newHistory;
    historyStep.current = newHistory.length - 1;
    setShapes([...shapes]);
  };

  // Undo/Redo/Clear
  const handleUndo = () => {
    if (historyStep.current === 0) return;
    historyStep.current -= 1;
    setShapes(history.current[historyStep.current]);
  };
  const handleRedo = () => {
    if (historyStep.current === history.current.length - 1) return;
    historyStep.current += 1;
    setShapes(history.current[historyStep.current]);
  };
  const handleClear = () => {
    setShapes([]);
    history.current = [[]];
    historyStep.current = 0;
  };

  // マウス・タッチ両対応
  const getPointerPos = (e) => {
    if (e.evt.touches && e.evt.touches.length > 0) {
      const touch = e.evt.touches[0];
      const stage = e.target.getStage();
      return stage.getPointerPosition(touch);
    }
    return e.target.getStage().getPointerPosition();
  };

  const handleDown = (e) => {
    const pos = getPointerPos(e);
    if (!pos) return;
    startDrawing(pos);
  };
  const handleMove = (e) => {
    const pos = getPointerPos(e);
    if (!pos) return;
    drawMove(pos);
  };

  // キャンバス外でマウス・タッチ終了
  useEffect(() => {
    const handleGlobalUp = () => (isDrawing.current = false);
    document.addEventListener("mouseup", handleGlobalUp);
    document.addEventListener("touchend", handleGlobalUp);
    return () => {
      document.removeEventListener("mouseup", handleGlobalUp);
      document.removeEventListener("touchend", handleGlobalUp);
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <Button type="default" onClick={() => setTool("pen")}isActiv={tool === "pen"}>pen</Button>
          <Button type="default" onClick={() => setTool("eraser")}isActiv={tool === "eraser"}>eraser</Button>
        </div>   
        {/* <div style={{ height:  5}}/>  */}
        <div style={{ display: "flex", gap: 4 ,padding:" 0 8px"}}>
          <Button onClick={handleUndo}>undo</Button>
          <Button onClick={handleRedo}>redo</Button>
          <Button onClick={handleClear}>all clear</Button>
        </div>
      </div>


      <div style={{ width: "100%", height: stageSize.height, border: "1px solid #dee2e6"}}>
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={endDrawing}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={endDrawing}
        >
          <Layer>
            <URLImage src={image2} stageWidth={stageSize.width} stageHeight={stageSize.height} />
          </Layer>
          <Layer>
            {shapes.map((shape, i) =>
              shape.tool === "pen" || shape.tool === "eraser" ? (
                <Line
                  key={i}
                  points={shape.points}
                  stroke={shape.color} 
                  strokeWidth={shape.tool === "eraser" ? 20 : 8}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={shape.tool === "eraser" ? "destination-out" : "source-over"}
                />
              ): null
            )}
          </Layer>
        </Stage>
      </div>

      {/*画像と下のボタンとの隙間 */}
      <div style={{ height: 5 }} />

        <div style={{ display: "flex", gap: 4}}>
          <Button type="color" style={{ backgroundColor: "#ffadad" }} onClick={() => setColor("#ffadad")}isActiv={color === "#ffadad"} />
          <Button type="color" style={{ backgroundColor: "#C8E6C9" }} onClick={() => setColor("#C8E6C9")}isActiv={color === "#C8E6C9"} />
          <Button type="color" style={{ backgroundColor: "#84c1ff" }} onClick={() => setColor("#84c1ff")} isActiv={color=="#84c1ff"}/>
        </div>
    </div>
  );
};

const URLImage = ({ src, stageWidth, stageHeight, ...rest }) => {
  const [image] = useImage(src);
  if (!image) return null;

  const ratio = image.width / image.height;
  let width = stageWidth;
  let height = stageHeight;

  if (stageWidth / stageHeight > ratio) {
    width = stageHeight * ratio;
  } else {
    height = stageWidth / ratio;
  }

  // ステージ中央に配置
  const x = (stageWidth - width) / 2;
  const y = (stageHeight - height) / 2;

  return <Image image={image} width={width} height={height} x={x} y={y} {...rest} />;
};

export default SketchScreen;
