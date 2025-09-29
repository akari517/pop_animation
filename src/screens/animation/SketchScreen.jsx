import React from "react";
import { Stage, Layer, Line,Image,Arc } from 'react-konva';
import useImage from "use-image";

import React, { useEffect, useRef, useState } from "react";
//画像のpath
//import sampleImage from "../assets/image4.jpg";
import image2 from "../../assets/image4.jpg";  


const URLImage = ({ src, ...rest }) => {
  const [image] = useImage(src, "anonymous");
  return (
    <Image
      image={image}
      width={((image?.width ?? 1) / (image?.height ?? 1)) * 500}
      height={500}
      {...rest}
    />
  );
};

const SketchScreen = () => {
  const isDrawing = React.useRef(false);
  const [lines, setLines] = useState([]);

  // 背景画像のロード処理
  // const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement>();
  // useEffect(() => {
  //   const image = new window.Image();
  //   image.src = "/img/sampledeno.jpeg";
  //   image.onload = () => {
  //     setBackgroundImage(image);
  //   };
  // }, []);

  // クリックした位置からペイントスタート
  const handleMouseDown = (e) => {
    const point = e.target.getStage()?.getPointerPosition();
    if (!point) return;
    isDrawing.current = true;
    // スタート位置をセット
    setLines([...lines, [point.x, point.y]]);
  };

  // マウスドラッグ中は現在地をセットし続ける
  const handleMouseMove = (e) => {
    const point = e.target.getStage()?.getPointerPosition();
    if (!point || !isDrawing.current) return;

    const lastIdx = lines.length - 1;
    setLines((prev) => [
      ...prev.slice(0, lastIdx),
      [...prev[lastIdx], point.x, point.y],
    ]);
  };

  // 離したタイミングでペイント終わる
  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <>
      <Button onClick={() => setLines([])}>all clear</Button>
      <div
        style={{
          width: 500,
          height: 500,
          border: "solid #dee2e6",
          backgroundColor: "#FFEEF0",
        }}
      >
        <Stage
          width={500}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Layerを分けるとお絵描き中、背景Img側Layerは再レンダリングされない */}
          <Layer>
            <URLImage src="/img/sampledeno.png" />
            {/* <Image
              image={backgroundImage}
              // アスペクト比維持
              width={
                ((backgroundImage?.width ?? 1) /
                  (backgroundImage?.height ?? 1)) *
                500
              }
              height={500}
            /> */}
          </Layer>
          <Layer>
            {lines.map((line, i) => (
              <Line key={i} points={line} stroke="black" />
            ))}
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default SketchScreen;