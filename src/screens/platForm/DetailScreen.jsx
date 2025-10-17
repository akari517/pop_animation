import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";
import "./DetailScreen.css";

// アイコンコンポーネント
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

  // === State管理 ===
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // === データ取得処理 ===
  const fetchWorkAndLikeData = useCallback(async () => {
    if (!workId) return;
    setLoading(true);
    try {
      const { data: workData, error: workError } = await supabase
        .from("works")
        .select(`*, work_genres ( genres ( genre_id, genre_name ) )`)
        .eq("work_id", workId)
        .single();
      if (workError) throw workError;

      let isLiked = false;
      if (currentUser) {
        const { data: likeData } = await supabase
          .from("likes")
          .select("work_id")
          .match({ user_id: currentUser.id, work_id: workId })
          .single();
        isLiked = !!likeData;
      }

      setWork({ ...workData, liked: isLiked });
      setEditedTitle(workData.title);
      setSelectedGenres(workData.work_genres.map((wg) => wg.genres.genre_id));
    } catch (error) {
      if (error.code !== "PGRST116") {
        console.error("投稿データの取得エラー:", error);
      }
      setWork(null);
    } finally {
      setLoading(false);
    }
  }, [workId, currentUser]);

  useEffect(() => {
    fetchWorkAndLikeData();

    const fetchAllGenres = async () => {
      const { data } = await supabase.from("genres").select("*");
      setAllGenres(data || []);
    };
    fetchAllGenres();
  }, [fetchWorkAndLikeData]);

  // === イベントハンドラ ===
  const handleLike = async () => {
    if (!currentUser || !work) {
      alert("いいねをするにはログインが必要です。");
      return;
    }
    const currentLikedStatus = work.liked;
    setWork((prevWork) => ({ ...prevWork, liked: !currentLikedStatus }));
    if (currentLikedStatus) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ user_id: currentUser.id, work_id: workId });
      if (error) {
        console.error("いいね解除エラー:", error);
        setWork((prevWork) => ({ ...prevWork, liked: currentLikedStatus }));
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert([{ user_id: currentUser.id, work_id: workId }]);
      if (error) {
        console.error("いいね追加エラー:", error);
        setWork((prevWork) => ({ ...prevWork, liked: currentLikedStatus }));
      }
    }
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      // alertの代わりにSnackbarを表示する
      setSnackbarOpen(true);
    } catch (error) {
      console.error("URLのコピーに失敗しました:", error);
      // エラー時はアラートを出すか、別のSnackbarを出すことも可能
      alert("URLのコピーに失敗しました。");
    }
  };

  // Snackbarを閉じるための関数
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setShowEditOptions(false);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const { error: updateError } = await supabase
        .from("works")
        .update({ title: editedTitle })
        .eq("work_id", workId);
      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from("work_genres")
        .delete()
        .eq("work_id", workId);
      if (deleteError) throw deleteError;

      if (selectedGenres.length > 0) {
        const newWorkGenres = selectedGenres.map((genreId) => ({
          work_id: workId,
          genre_id: genreId,
        }));
        const { error: insertError } = await supabase
          .from("work_genres")
          .insert(newWorkGenres);
        if (insertError) throw insertError;
      }
      alert("更新が完了しました。");
      setIsEditing(false);

      // 手動でstateを更新（再取得より高速）
      const updatedGenresForState = allGenres
        .filter((genre) => selectedGenres.includes(genre.genre_id))
        .map((genre) => ({
          genres: {
            genre_id: genre.genre_id,
            genre_name: genre.genre_name,
          },
        }));
      setWork((prevWork) => ({
        ...prevWork,
        title: editedTitle,
        work_genres: updatedGenresForState,
      }));
    } catch (error) {
      console.error("更新エラー:", error);
      alert("更新に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  // === レンダリング処理 ===
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

  const isOwner = currentUser && currentUser.id === work.user_id;

  return (
    <div className="detail-container">
      <button
        onClick={() => (isEditing ? setIsEditing(false) : navigate(-1))}
        className="back-button"
      >
        {isEditing ? "キャンセル" : "← 戻る"}
      </button>

      <div className="detail-card">
        <img
          src={work.url}
          alt={isEditing ? editedTitle : work.title}
          className="detail-image"
        />

        {isEditing ? (
          <div className="edit-form-container">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="title-input"
            />
            <div className="genres-container-edit">
              {allGenres.map((genre) => (
                <label key={genre.genre_id}>
                  <input
                    type="checkbox"
                    value={genre.genre_id}
                    checked={selectedGenres.includes(genre.genre_id)}
                    onChange={() => handleGenreChange(genre.genre_id)}
                  />
                  {genre.genre_name}
                </label>
              ))}
            </div>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="save-button"
            >
              {isSaving ? "保存中..." : "保存"}
            </button>
          </div>
        ) : (
          <>
            {work.work_genres && work.work_genres.length > 0 && (
              <div className="genres-container">
                {work.work_genres.map(({ genres }) => (
                  <span key={genres.genre_name} className="genre-tag">
                    #{genres.genre_name}
                  </span>
                ))}
              </div>
            )}
            <div className="detail-actions">
              <p className="detail-title">{work.title}</p>
              <div className="detail-buttons">
                <ShareIcon onClick={handleShare} />
                <HeartIcon liked={work.liked} onClick={handleLike} />
                {isOwner && (
                  <button
                    onClick={() => setShowEditOptions(true)}
                    className="edit-button"
                  >
                    編集
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {showEditOptions && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>編集メニュー</h3>
            <button onClick={handleStartEditing}>
              タイトル・タグを編集する
            </button>
            <button disabled>アニメーションを編集する</button>
            <button
              onClick={() => setShowEditOptions(false)}
              className="modal-close-button"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // 3秒後に自動で閉じる
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // 画面下部中央に表示
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success" // 緑色の「成功」スタイル
          sx={{ width: "100%" }}
        >
          URLをクリップボードにコピーしました！
        </Alert>
      </Snackbar>
    </div>
  );
}

export default DetailScreen;
