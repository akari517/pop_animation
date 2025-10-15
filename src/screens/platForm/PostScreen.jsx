// components/PostScreen.jsx のようなパスに作成

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

function PostScreen() {
  const [step, setStep] = useState(1); // 1: 画像アップロード, 2: タイトル入力
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [allGenres, setAllGenres] = useState([]); // DBから取得した全ジャンル
  const [selectedGenres, setSelectedGenres] = useState([]); // 選択されたジャンルのIDを保持
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase.from("genres").select("*");
      if (error) {
        console.error("ジャンルの取得エラー:", error);
      } else {
        setAllGenres(data);
      }
    };
    fetchGenres();
  }, []);
  // ファイルが選択されたときの処理
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // ステップ1: 画像をアップロードする処理
  const handleUpload = async () => {
    if (!file) {
      alert("画像ファイルを選択してください。");
      return;
    }
    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("images") // 作成したバケット名
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // アップロードした画像の公開URLを取得
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);

      setImageUrl(data.publicUrl);
      setStep(2); // 次のステップへ
    } catch (error) {
      console.error("アップロードエラー:", error);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres(
      (prev) =>
        prev.includes(genreId)
          ? prev.filter((id) => id !== genreId) // 既に選択されていれば解除
          : [...prev, genreId] // 選択されていなければ追加
    );
  };

  // ステップ2: タイトルを設定してデータを投稿する処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("タイトルを入力してください。");
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. worksテーブルに基本データを投稿し、新しいwork_idを取得
      const workData = {
        title: title,
        url: imageUrl,
        user_id: currentUser ? currentUser.id : null,
      };

      const { data: newWork, error: workError } = await supabase
        .from("works")
        .insert([workData])
        .select() // 挿入したデータを返すように指定
        .single(); // 単一のオブジェクトとして受け取る

      if (workError) throw workError;

      // 2. 選択されたジャンルがあれば、work_genresテーブルに保存
      if (selectedGenres.length > 0) {
        const workGenresData = selectedGenres.map((genreId) => ({
          work_id: newWork.work_id,
          genre_id: genreId,
        }));

        const { error: genreError } = await supabase
          .from("work_genres")
          .insert(workGenresData);

        if (genreError) throw genreError;
      }

      alert("投稿が完了しました！");
      navigate("/home");
    } catch (error) {
      console.error("投稿エラー:", error);
      alert("投稿に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="screen-container">
      {step === 1 && (
        <div>
          <h1>ステップ1: 写真を投稿する</h1>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange} // ← handleFileChange を使用
          />
          <button
            onClick={handleUpload} // ← handleUpload を使用
            className="button"
            disabled={isUploading || !file} // ← isUploading を使用
          >
            {isUploading ? "アップロード中..." : "次へ"}{" "}
            {/* ← isUploading を使用 */}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1>ステップ2: 詳細を入力</h1>
          <img
            src={imageUrl}
            alt="アップロードプレビュー"
            style={{
              maxWidth: "300px",
              maxHeight: "300px",
              marginBottom: "20px",
            }}
          />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="作品のタイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                maxWidth: "300px",
                padding: "10px",
                marginBottom: "10px",
                boxSizing: "border-box",
              }}
            />

            {/* ▼▼▼ ジャンル選択のチェックボックスを追加 ▼▼▼ */}
            <div
              style={{
                maxWidth: "300px",
                margin: "0 auto 20px",
                textAlign: "left",
              }}
            >
              <p style={{ marginBottom: "5px", fontWeight: "bold" }}>
                ジャンルを選択 (複数可)
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {allGenres.map((genre) => (
                  <label key={genre.genre_id} style={{ cursor: "pointer" }}>
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
            </div>

            <button type="submit" className="button" disabled={isSubmitting}>
              {isSubmitting ? "投稿中..." : "投稿を完了する"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostScreen;
