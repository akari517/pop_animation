// src/components/MyPageScreen.jsx
import React from "react";
import { Link } from "react-router-dom";

function MyPageScreen() {
  return (
    <div className="screen-container">
      <h1>マイページ</h1>
      <h1>アニメーションへの画面遷移</h1>
      <Link to="/animation" className="button" style={{ backgroundColor: "#888" }}>
      アニメーションホームへ
      </Link>
      <p>この画面は現在準備中です。</p>
      {/* ログアウト機能を想定 */}
      <Link to="/auth" className="button" style={{ backgroundColor: "#888" }}>
        ログアウト
      </Link>
    </div>
  );
}

export default MyPageScreen;
