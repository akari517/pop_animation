// src/components/LoginScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function LoginScreen() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 本来はここで認証処理を行う
    console.log("ログイン処理...");
    navigate("/home/image1"); // 閲覧画面へ遷移
  };

  return (
    <div className="screen-container">
      <h1>ログイン</h1>
      {/* 実際のフォームは省略 */}
      <button onClick={handleLogin} className="button">
        ログインする
      </button>
    </div>
  );
}

export default LoginScreen;
