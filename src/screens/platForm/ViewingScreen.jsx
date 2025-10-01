import React, { useState, useEffect } from "react";
import "./ViewingScreen.css";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

// assetsフォルダから画像をインポート
import image1 from "../../assets/image1.jpg";
import image2 from "../..//assets/image2.jpg";
import image3 from "../../assets/image3.jpg";

// 初期データ（アプリ内で画像情報を一元管理できるようにエクスポートしておく）
export const localImageList = [
  { id: "image1", src: image1 },
  { id: "image2", src: image2 },
  { id: "image3", src: image3 },
];
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
  const [imageList, setImageList] = useState([]);
  const { currentUser } = useAuth(); // ログイン中のユーザー情報を取得

  // 最初に画像といいね情報を読み込む
  useEffect(() => {
    const fetchImagesAndLikes = async () => {
      // ログインしている場合のみ、いいね情報を取得
      if (currentUser) {
        const { data: userLikes, error } = await supabase
          .from("likes")
          .select("image_id")
          .eq("user_id", currentUser.id);

        if (error) {
          console.error("いいね情報の取得エラー:", error);
          return;
        }

        const likedImageIds = userLikes.map((like) => like.image_id);
        const mergedImageList = localImageList.map((image) => ({
          ...image,
          liked: likedImageIds.includes(image.id),
        }));
        setImageList(mergedImageList);
      } else {
        // ログインしていない場合は、いいねなしの状態で表示
        const unlikedImageList = localImageList.map((image) => ({
          ...image,
          liked: false,
        }));
        setImageList(unlikedImageList);
      }
    };

    fetchImagesAndLikes();
  }, [currentUser]); // currentUserが変わるたびに再実行

  // いいねボタンの処理
  const handleLike = async (id, currentLikedStatus) => {
    if (!currentUser) {
      alert("いいねをするにはログインが必要です。");
      return;
    }

    // 先にUIを更新して即時反映させる
    const updatedList = imageList.map((image) =>
      image.id === id ? { ...image, liked: !image.liked } : image
    );
    setImageList(updatedList);

    if (currentLikedStatus) {
      // いいね解除：データベースから削除
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ user_id: currentUser.id, image_id: id });
      if (error) console.error("いいね解除エラー:", error);
    } else {
      // いいね追加：データベースに挿入
      const { error } = await supabase
        .from("likes")
        .insert([{ user_id: currentUser.id, image_id: id }]);
      if (error) console.error("いいね追加エラー:", error);
    }
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
              onClick={() => handleLike(image.id, image.liked)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewingScreen;
