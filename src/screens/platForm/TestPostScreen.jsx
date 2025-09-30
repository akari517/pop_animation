// src/components/Animation/PostScreen.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; // supabaseClientのパスを確認

function TestPostScreen() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // ファイルが選択されたときに呼ばれる関数
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // フォームが送信されたときに呼ばれる関数
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("画像ファイルを選択してください。");
      return;
    }

    setUploading(true);
    try {
      // 1. 画像をSupabase Storageにアップロード
      const fileName = `${Date.now()}_${file.name}`; // ファイル名が重複しないように現在時刻を付与
      const { error: uploadError } = await supabase.storage
        .from("images") // ステップ1で作成したバケツ名
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. アップロードした画像の公開URLを取得
      //   const {
      //     data: { publicUrl },
      //   } = supabase.storage.from("posts").getPublicUrl(fileName);

      // 3. 画像のURLをSupabase Databaseに保存
      //   const { error: insertError } = await supabase
      //     .from("images") // ステップ2で作成したテーブル名
      //     .insert([{ image_url: publicUrl }]);

      //if (insertError) throw insertError;

      alert("投稿が完了しました！");
      navigate("/home"); // ホーム画面に遷移
    } catch (error) {
      console.error("投稿エラー:", error);
      alert("エラーが発生しました。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="screen-container">
      <h1>画像投稿</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" className="button" disabled={uploading}>
          {uploading ? "投稿中..." : "投稿する"}
        </button>
      </form>
    </div>
  );
}

export default TestPostScreen;
