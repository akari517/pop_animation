import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";
import AnimationViewer from "./AnimationViewer";
import "./DetailScreen.css";

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

function DetailScreen() {
  const { workId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [animations, setAnimations] = useState([]);

  const fetchWorkAndLikeData = useCallback(async () => {
    if (!workId) return;
    setLoading(true);
    try {
      const { data: workData, error: workError } = await supabase
        .from("works")
        .select("*")
        .eq("work_id", Number(workId))
        .single();
      if (workError) throw workError;

      let isLiked = false;
      if (currentUser) {
        const { data: likeData } = await supabase
          .from("likes")
          .select("work_id")
          .match({ user_id: currentUser.id, work_id: Number(workId) })
          .single();
        isLiked = !!likeData;
      }

      setWork({ ...workData, liked: isLiked });
    } catch (error) {
      console.error(error);
      setWork(null);
    } finally {
      setLoading(false);
    }
  }, [workId, currentUser]);

  useEffect(() => {
    fetchWorkAndLikeData();
  }, [fetchWorkAndLikeData]);

  useEffect(() => {
    const fetchAnimations = async () => {
      if (!workId) return;
      const { data, error } = await supabase
        .from("animations")
        .select("animation_data")
        .eq("work_id", Number(workId))
        .order("created_at", { ascending: false });
      if (!error && data) setAnimations(data);
    };
    fetchAnimations();
  }, [workId]);

  const handleLike = async () => {
    if (!currentUser || !work) return;
    const currentLiked = work.liked;
    setWork((prev) => ({ ...prev, liked: !currentLiked }));
    if (currentLiked) {
      await supabase.from("likes").delete().match({ user_id: currentUser.id, work_id: Number(workId) });
    } else {
      await supabase.from("likes").insert([{ user_id: currentUser.id, work_id: Number(workId) }]);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSnackbarOpen(true);
    } catch {
      alert("コピー失敗");
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (loading) return <div className="detail-container">読み込み中...</div>;
  if (!work) return <div className="detail-container">投稿が見つかりません</div>;

  const animationData =
    animations.length === 0
      ? null
      : (() => {
          const frames = animations.map((a) => ({
            shapes: a.animation_data?.frames ? a.animation_data.frames[0] || [] : [],
            stamps: a.animation_data?.stamps || [],
          }));
          
          const first = animations[0].animation_data;
          
          // 🌟 修正: frames が配列であることを確認し、そうでない場合は空配列 [] を使用 🌟
          const reversedFrames = Array.isArray(frames) ? frames.reverse() : [];

          return {
            frames: reversedFrames, // 安全な変数を使用
            selectedImage: first?.selectedImage || null,
            // 昔の作品の再現に必要なデフォルト値
            savedWidth: first?.savedWidth || 800, // 正しいデフォルト値に置き換えてください
            savedHeight: first?.savedHeight || 600, // 正しいデフォルト値に置き換えてください
            frameInterval: 250, 
          };
        })();
        
  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← 戻る
      </button>

      <div className="detail-card">
        {animationData ? (
          <AnimationViewer animationData={animationData} width={600} height={400} />
        ) : (
          <div>アニメーションがありません</div>
        )}

        <div className="detail-actions">
          <p className="detail-title">{work.title}</p>
          <div className="detail-buttons">
            <ShareIcon onClick={handleShare} />
            <HeartIcon liked={work.liked} onClick={handleLike} />
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          URLをコピーしました！
        </Alert>
      </Snackbar>
    </div>
  );
}

export default DetailScreen;