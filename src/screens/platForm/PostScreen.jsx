// components/PostScreen.jsx のようなパスに作成

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

function PostScreen() {
  const [step, setStep] = useState(1); // 1: 画像アップロード, 2: タイトル入力
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

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
      const fileName = `${Date.now()}_${file.name}`;
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

  // ステップ2: タイトルを設定してデータを投稿する処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("タイトルを入力してください。");
      return;
    }
    setIsSubmitting(true);

    try {
      const workData = {
        title: title,
        url: imageUrl,
        user_id: currentUser ? currentUser.id : null, // ログインしていればIDを、していなければnullをセット
      };

      const { error } = await supabase
        .from("works") // 作成したテーブル名
        .insert([workData]);

      if (error) throw error;

      alert("投稿が完了しました！");
      navigate("/home"); // ホーム画面に戻る
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
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            className="button"
            disabled={isUploading || !file}
          >
            {isUploading ? "アップロード中..." : "次へ"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1>ステップ2: タイトルを設定する</h1>
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
