import React, { useState, useEffect } from "react";
import "./ViewingScreen.css";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
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

      // ▼▼▼ この部分をよりシンプルに ▼▼▼

      let likedWorkIds = new Set(); // IDの検索を高速化するためSetを使用

      // 2. ログインしている場合のみ、いいね情報を取得してSetに追加
      if (currentUser) {
        const { data: userLikes, error: likesError } = await supabase
          .from("likes")
          .select("work_id")
          .eq("user_id", currentUser.id);

        if (likesError) {
          console.error("いいね情報の取得エラー:", likesError);
        } else if (userLikes) {
          likedWorkIds = new Set(userLikes.map((like) => like.work_id));
        }
      }

      // 3. ログイン状態に関わらず、一度だけ投稿データにいいね情報をマージ
      const mergedWorks = worksData.map((work) => ({
        ...work,
        liked: likedWorkIds.has(work.work_id),
      }));
      setWorks(mergedWorks);

      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  // いいねボタンの処理
  const handleLike = async (event, workId, currentLikedStatus) => {
    event.preventDefault();
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
        .match({ user_id: currentUser.id, work_id: workId });
    } else {
      // いいね追加
      await supabase
        .from("likes")
        .insert([{ user_id: currentUser.id, work_id: workId }]);
    }
  };

  const handleShare = (event, id) => {
    event.preventDefault();
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
        <Link
          to={`/work/${work.work_id}`}
          key={work.work_id}
          className="work-card-link"
        >
          <div key={work.work_id} className="image-card">
            <img src={work.url} alt={work.title} className="feed-image" />
            <div className="actions-container">
              <p className="work-title">{work.title}</p>
              <div className="icon-buttons">
                <ShareIcon
                  onClick={(event) => handleShare(event, work.work_id)}
                />
                <HeartIcon
                  liked={work.liked}
                  onClick={(event) =>
                    handleLike(event, work.work_id, work.liked)
                  }
                />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ViewingScreen;
