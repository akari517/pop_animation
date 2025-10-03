import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; // Supabaseのログアウトを使う場合はこちら
import { useAuth } from "../../contexts/AuthContext";

function MyPageScreen() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [likedWorks, setLikedWorks] = useState([]); // likedImagesからlikedWorksに名称変更
  const [loading, setLoading] = useState(true);

  // 最初にいいねした投稿を取得する
  useEffect(() => {
    const fetchLikedWorks = async () => {
      if (currentUser) {
        try {
          setLoading(true);

          // 1. ログインユーザーがいいねした投稿のIDリストを取得
          const { data: userLikes, error: likesError } = await supabase
            .from("likes")
            .select("image_id") // image_idにはwork_idが入っている
            .eq("user_id", currentUser.id);

          if (likesError) throw likesError;

          const likedWorkIds = userLikes.map((like) => like.image_id);

          // 2. いいねした投稿IDが1つ以上あれば、worksテーブルから詳細情報を取得
          if (likedWorkIds.length > 0) {
            const { data: worksData, error: worksError } = await supabase
              .from("works")
              .select("*")
              .in("work_id", likedWorkIds); // .in()でIDリストに一致するものを全て取得

            if (worksError) throw worksError;
            setLikedWorks(worksData);
          } else {
            setLikedWorks([]); // いいねした投稿がない場合は空にする
          }
        } catch (error) {
          console.error("いいねした投稿の取得エラー:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLikedWorks();
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

      <h2 style={{ marginTop: "40px" }}>いいねした投稿</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : likedWorks.length > 0 ? (
        <div className="liked-images-grid">
          {likedWorks.map((work) => (
            <img
              key={work.work_id}
              src={work.url} // work.url を使用
              alt={work.title} // work.title を使用
              className="liked-image-thumbnail"
            />
          ))}
        </div>
      ) : (
        <p>いいねした投稿はありません。</p>
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
