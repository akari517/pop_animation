// src/components/MyPageScreen.jsx
import React from "react";
import { Link } from "react-router-dom";

function MyPageScreen() {
  return (
    <div className="screen-container">
      <h1>マイページ</h1>
      <p>この画面は現在準備中です。</p>
      {/* ログアウト機能を想定 */}
      <Link to="/auth" className="button" style={{ backgroundColor: "#888" }}>
        ログアウト
      </Link>
    </div>
  );
}

export default MyPageScreen;
