import React, { useState, useEffect } from "react";
import "./ViewingScreen.css";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

// アイコンコンポーネント (変更なし)
const HeartIcon = ({ liked, onClick }) => (
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
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // 最初に投稿といいね情報を読み込む
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. 全ての投稿をworksテーブルから取得
      const { data: worksData, error: worksError } = await supabase
        .from("works")
        .select("*")
        .order("created_at", { ascending: false });

      if (worksError) {
        console.error("投稿の取得エラー:", worksError);
        setLoading(false);
        return;
      }

      // 2. ログインしている場合は、いいね情報を取得
      if (currentUser) {
        const { data: userLikes, error: likesError } = await supabase
          .from("likes")
          .select("image_id") // ここではwork_idを指す
          .eq("user_id", currentUser.id);

        if (likesError) {
          console.error("いいね情報の取得エラー:", likesError);
        }

        const likedWorkIds = userLikes
          ? userLikes.map((like) => like.image_id)
          : [];

        // 投稿データに、いいね済みかどうかの情報を追加
        const mergedWorks = worksData.map((work) => ({
          ...work,
          liked: likedWorkIds.includes(work.work_id),
        }));
        setWorks(mergedWorks);
      } else {
        // ログインしていない場合は、いいねなしの状態で表示
        const unlikedWorks = worksData.map((work) => ({
          ...work,
          liked: false,
        }));
        setWorks(unlikedWorks);
      }

      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  // いいねボタンの処理
  const handleLike = async (workId, currentLikedStatus) => {
    if (!currentUser) {
      alert("いいねをするにはログインが必要です。");
      return;
    }

    // UIを即時更新
    setWorks(
      works.map((work) =>
        work.work_id === workId ? { ...work, liked: !work.liked } : work
      )
    );

    if (currentLikedStatus) {
      // いいね解除
      await supabase
        .from("likes")
        .delete()
        .match({ user_id: currentUser.id, image_id: workId });
    } else {
      // いいね追加
      await supabase
        .from("likes")
        .insert([{ user_id: currentUser.id, image_id: workId }]);
    }
  };

  const handleShare = (id) => {
    console.log(`Sharing work: ${id}`);
    alert(`作品を共有します: ${id}`);
  };

  if (loading) {
    return (
      <div className="screen-container">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {works.map((work) => (
        <div key={work.work_id} className="image-card">
          <img src={work.url} alt={work.title} className="feed-image" />
          <div className="actions-container">
            <p className="work-title">{work.title}</p>
            <div className="icon-buttons">
              <ShareIcon onClick={() => handleShare(work.work_id)} />
              <HeartIcon
                liked={work.liked}
                onClick={() => handleLike(work.work_id, work.liked)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewingScreen;
