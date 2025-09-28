import React from "react";
import { Stage, Layer, Line, Text } from 'react-konva';
import useImage from "use-image";
//画像のpath
//import sampleImage from "../assets/image4.jpg";
import sampleImage from "../../assets/image4.jpg";

function SketchScreen() {
  const [image] = useImage(sampleImage);// ここで画像を読み込む
    console.log("image", image);
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    // 新しい点を追加
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };
  
  console.log();
  return (
    <div className="screen-container">
    <h1>ようこそ！</h1>
    <>
  
    </>
    <div style={{ width: "300", height: "200" }}>
      <Stage
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {image && <Image image={image} x={0} y={100} width={300} height={200} />}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="red"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
      </div>
    </div>
  );
}

export default SketchScreen;
