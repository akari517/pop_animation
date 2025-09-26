// src/components/ViewingScreen.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // hookをインポート
import { useSwipeable } from "react-swipeable";
import "./ViewingScreen.css";

// assetsフォルダから画像をインポート
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";

// ▼ 画像の情報をIDとセットで管理する
const imageList = [
  { id: "image1", src: image1 },
  { id: "image2", src: image2 },
  { id: "image3", src: image3 },
];

function ViewingScreen() {
  const { imageId } = useParams(); // URLからimageIdを取得
  const navigate = useNavigate(); // URL遷移のためのhook

  // URLのimageIdから現在のインデックスを算出
  const currentIndex = imageList.findIndex((img) => img.id === imageId);

  const handlers = useSwipeable({
    onSwipedUp: () => showNextImage(),
    onSwipedDown: () => showPrevImage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const showNextImage = () => {
    if (currentIndex < imageList.length - 1) {
      const nextImageId = imageList[currentIndex + 1].id;
      navigate(`/home/${nextImageId}`); // URLを次の画像のIDに変更
    }
  };

  const showPrevImage = () => {
    if (currentIndex > 0) {
      const prevImageId = imageList[currentIndex - 1].id;
      navigate(`/home/${prevImageId}`); // URLを前の画像のIDに変更
    }
  };

  // URLに対応する画像が見つからない場合、最初の画像にリダイレクト
  useEffect(() => {
    if (currentIndex === -1) {
      navigate("/home/image1");
    }
  }, [currentIndex, navigate]);

  // 画像が見つからない場合は何も表示しない（リダイレクトが実行されるため）
  if (currentIndex === -1) {
    return null;
  }

  return (
    <div {...handlers} className="viewing-container">
      <div
        className="image-slider"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {imageList.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.id}
            className="displayed-image"
          />
        ))}
      </div>
    </div>
  );
}

export default ViewingScreen;
