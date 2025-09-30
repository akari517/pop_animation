import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; // Supabaseのログアウトを使う場合はこちら
import { useAuth } from "../../contexts/AuthContext";
import { localImageList } from "./ViewingScreen"; // ViewingScreenから画像リストをインポート

function MyPageScreen() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [likedImages, setLikedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 最初にいいねした画像を取得
  useEffect(() => {
    const fetchLikedImages = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const { data: userLikes, error } = await supabase
            .from("likes")
            .select("image_id")
            .eq("user_id", currentUser.id);

          if (error) throw error;

          const likedImageIds = userLikes.map((like) => like.image_id);
          // ローカルの画像リストから、いいねしたIDに一致する画像だけをフィルタリング
          const filteredImages = localImageList.filter((image) =>
            likedImageIds.includes(image.id)
          );
          setLikedImages(filteredImages);
        } catch (error) {
          console.error("いいねした画像の取得エラー:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLikedImages();
  }, [currentUser]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウトに失敗しました", error);
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="screen-container"
      style={{ justifyContent: "flex-start", paddingTop: "20px" }}
    >
      <h1>マイページ</h1>
      {currentUser && <p>ようこそ, {currentUser.email} さん</p>}

      <h2 style={{ marginTop: "40px" }}>いいねした画像</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : likedImages.length > 0 ? (
        <div className="liked-images-grid">
          {likedImages.map((image) => (
            <img
              key={image.id}
              src={image.src}
              alt={image.id}
              className="liked-image-thumbnail"
            />
          ))}
        </div>
      ) : (
        <p>いいねした画像はありません。</p>
      )}

      <button
        onClick={handleLogout}
        className="button"
        style={{ backgroundColor: "#888", marginTop: "40px" }}
      >
        ログアウト
      </button>
    </div>
  );
}

export default MyPageScreen;
