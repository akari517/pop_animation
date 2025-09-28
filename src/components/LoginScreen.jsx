// src/components/LoginScreen.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // react-router-domからLinkをインポート
import { supabase } from "../supabaseClient";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      navigate("/mypage");
    } catch (err) {
      setError("ログインに失敗しました。");
    }
  };

  return (
    <div className="screen-container">
      <h1>ログイン</h1>
      <form
        onSubmit={handleLogin}
        style={{ width: "80%", maxWidth: "300px", textAlign: "center" }}
      >
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" className="button">
          ログイン
        </button>
      </form>

      {/* ▼ 新規登録画面へのリンクを追加 ▼ */}
      <p style={{ marginTop: "20px" }}>
        アカウントをお持ちでないですか？ <Link to="/register">新規登録</Link>
      </p>
    </div>
  );
}

export default LoginScreen;
