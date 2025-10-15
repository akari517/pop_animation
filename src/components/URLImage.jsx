import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";

const URLImage = ({ src, stageWidth, stageHeight, ...rest }) => {
  const [image] = useImage(src, "anonymous"); // クロスオリジン対策
  if (!image) return null;

  const ratio = image.width / image.height;
  let width = stageWidth;
  let height = stageHeight;

  if (stageWidth / stageHeight > ratio) {
    width = stageHeight * ratio;
  } else {
    height = stageWidth / ratio;
  }

  const x = (stageWidth - width) / 2;
  const y = (stageHeight - height) / 2;

  return <Image image={image} width={width} height={height} x={x} y={y} {...rest} />;
};

export default URLImage;
