// src/components/Layout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./Layout.css";

// アイコンのインポート（今回は絵文字で代用）
const HomeIcon = () => "🏠";
const PostIcon = () => "➕";
const FavIcon = () => "❤️";
const MyPageIcon = () => "👤";

function Layout() {
  return (
    <div className="layout-container">
      <main className="main-content">
        <Outlet /> {/* ここに各ページのコンポーネントが表示される */}
      </main>
      <nav className="bottom-nav">
        <NavLink to="/home" className="nav-item">
          <HomeIcon />
          <span>ホーム</span>
        </NavLink>
        <NavLink to="/post" className="nav-item">
          <PostIcon />
          <span>投稿</span>
        </NavLink>
        <NavLink to="/favorites" className="nav-item">
          <FavIcon />
          <span>お気に入り</span>
        </NavLink>
        <NavLink to="/mypage" className="nav-item">
          <MyPageIcon />
          <span>マイページ</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Layout;
