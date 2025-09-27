// src/screens/platorm/ViewingScreen.jsx
import React, { useState } from "react";
import "./ViewingScreen.css"; 

// assetsフォルダから画像をインポート
import image1 from "../../assets/image1.jpg";
import image2 from "../..//assets/image2.jpg";
import image3 from "../../assets/image3.jpg";

// 初期データ
const initialImageList = [
  { id: "image1", src: image1, liked: false },
  { id: "image2", src: image2, liked: false },
  { id: "image3", src: image3, liked: false },
];

// アイコンコンポーネント
// src/components/ViewingScreen.jsx

// ...

// アイコンコンポーネント
const HeartIcon = ({ liked, onClick }) => (
  // ▼ fill を 'none' に、stroke を 'black' に変更
  <svg
    onClick={onClick}
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill={liked ? "red" : "none"}
    stroke="black"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ cursor: "pointer" }}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ShareIcon = ({ onClick }) => (
  // ▼ stroke を 'black' に変更
  <svg
    onClick={onClick}
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ cursor: "pointer" }}
  >
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
    <path d="M16 3h5v5"></path>
    <path d="M10 14L21 3"></path>
  </svg>
);

function ViewingScreen() {
  const [imageList, setImageList] = useState(initialImageList);

  // いいねボタンの処理
  const handleLike = (id) => {
    setImageList((prevList) =>
      prevList.map((image) =>
        image.id === id ? { ...image, liked: !image.liked } : image
      )
    );
  };

  // 共有ボタンの処理（今回はコンソールに出力するだけ）
  const handleShare = (id) => {
    console.log(`Sharing image: ${id}`);
    alert(`画像を共有します: ${id}`);
  };

  return (
    <div className="feed-container">
      {imageList.map((image) => (
        <div key={image.id} className="image-card">
          <img src={image.src} alt={image.id} className="feed-image" />
          <div className="actions-container">
            <ShareIcon onClick={() => handleShare(image.id)} />
            <HeartIcon
              liked={image.liked}
              onClick={() => handleLike(image.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewingScreen;
