// src/components/DetailScreen.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import "./DetailScreen.css"; // 詳細画面用のCSSを後で作成

// ViewingScreenからアイコンコンポーネントを再利用
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
  const { workId } = useParams(); // URLからworkIdを取得
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWork = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("works")
          .select("*")
          .eq("work_id", workId)
          .single(); // .single()で単一のレコードを取得

        if (error) throw error;
        setWork(data);
      } catch (error) {
        console.error("投稿データの取得エラー:", error);
        setWork(null); // データが見つからなかった場合
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [workId]);

  // いいね・共有ボタンのハンドラ（ViewingScreenと同様）
  const handleLike = () => {
    /* ... いいね処理 ... */
  };
  const handleShare = () => {
    /* ... 共有処理 ... */
  };

  if (loading) {
    return (
      <div className="detail-container">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="detail-container">
        <p>投稿が見つかりません。</p>
      </div>
    );
  }

  // ログイン中のユーザーIDと投稿のユーザーIDが一致するかどうかを判定
  const isOwner = currentUser && currentUser.id === work.user_id;

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← 戻る
      </button>

      <div className="detail-card">
        <img src={work.url} alt={work.title} className="detail-image" />
        <div className="detail-actions">
          <p className="detail-title">{work.title}</p>
          <div className="detail-buttons">
            <ShareIcon onClick={handleShare} />
            <HeartIcon liked={false} onClick={handleLike} />
            {isOwner && <button className="edit-button">編集</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailScreen;
