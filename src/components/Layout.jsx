// src/components/Layout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./Layout.css";
import { useAuth } from "../context/AuthContext"; // ← インポート

import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login"; // ログインアイコンを追加

function Layout() {
  const { currentUser } = useAuth(); // ← ログイン状態を取得

  return (
    <div className="layout-container">
      <main className="main-content">
        <Outlet />
      </main>
      <nav className="bottom-nav">
        <NavLink to="/home" className="nav-item">
          <HomeIcon />
          <span>ホーム</span>
        </NavLink>
        <NavLink to="/post" className="nav-item">
          <AddCircleOutlineIcon />
          <span>投稿</span>
        </NavLink>

        {/* ▼ ログイン状態に応じて表示を切り替え */}
        {currentUser ? (
          <NavLink to="/mypage" className="nav-item">
            <AccountCircleIcon />
            <span>マイページ</span>
          </NavLink>
        ) : (
          <NavLink to="/login" className="nav-item">
            <LoginIcon />
            <span>ログイン</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
}

export default Layout;