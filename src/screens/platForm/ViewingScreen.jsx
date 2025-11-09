import React, { useState, useEffect } from "react";
import { supabase } from "../../SupabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import "./ViewingScreen.css";

// Heart アイコン
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
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// Share アイコン
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
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
    <path d="M16 3h5v5" />
    <path d="M10 14L21 3" />
  </svg>
);

function ViewingScreen() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 投稿取得
        const { data: worksData, error: worksError } = await supabase
          .from("works")
          .select("*")
          .order("created_at", { ascending: false });

        if (worksError) throw worksError;

        let likedWorkIds = new Set();

        if (currentUser) {
          const { data: userLikes, error: likesError } = await supabase
            .from("likes")
            .select("work_id")
            .eq("user_id", currentUser.id);

          if (likesError) {
            console.error("いいね情報取得エラー:", likesError);
          } else if (userLikes) {
            likedWorkIds = new Set(userLikes.map((like) => like.work_id));
          }
        }

        const mergedWorks = (worksData || []).map((work) => ({
          ...work,
          liked: likedWorkIds.has(work.work_id),
        }));

        setWorks(mergedWorks);
      } catch (error) {
        console.error("投稿取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // いいね
  const handleLike = async (event, workId, currentLikedStatus) => {
    event.preventDefault();
    if (!currentUser) {
      alert("ログインが必要です。");
      return;
    }

    setWorks((prevWorks) =>
      prevWorks.map((work) =>
        work.work_id === workId ? { ...work, liked: !currentLikedStatus } : work
      )
    );

    try {
      if (currentLikedStatus) {
        await supabase.from("likes").delete().match({
          user_id: currentUser.id,
          work_id: workId,
        });
      } else {
        await supabase
          .from("likes")
          .insert([{ user_id: currentUser.id, work_id: workId }]);
      }
    } catch (error) {
      console.error("いいね処理エラー:", error);
      // UI戻す
      setWorks((prevWorks) =>
        prevWorks.map((work) =>
          work.work_id === workId ? { ...work, liked: currentLikedStatus } : work
        )
      );
    }
  };

  // 共有
  const handleShare = async (event, workId) => {
    event.preventDefault();
    const postUrl = `${window.location.origin}/work/${workId}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("URLコピー失敗:", error);
      alert("URLのコピーに失敗しました。");
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  if (loading)
    return (
      <div className="screen-container">
        <p>読み込み中...</p>
      </div>
    );

  return (
    <div className="feed-container">
      {works.map((work) => (
        <Link
          to={`/work/${work.work_id}`}
          key={work.work_id}
          className="work-card-link"
        >
          <div className="image-card">
            <img src={work.url} alt={work.title} className="feed-image" />
            <div className="actions-container">
              <p className="work-title">{work.title}</p>
              <div className="icon-buttons">
                <ShareIcon
                  onClick={(e) => handleShare(e, work.work_id)}
                />
                <HeartIcon
                  liked={work.liked}
                  onClick={(e) => handleLike(e, work.work_id, work.liked)}
                />
              </div>
            </div>
          </div>
        </Link>
      ))}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          URLをクリップボードにコピーしました！
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ViewingScreen;
