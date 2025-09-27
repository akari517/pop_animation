// src/components/Layout.jsx

import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./Layout.css";

// ▼ MUIからアイコンをインポート
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Layout() {
  return (
    <div className="layout-container">
      <main className="main-content">
        <Outlet />
      </main>
      <nav className="bottom-nav">
        <NavLink to="/home" className="nav-item">
          {/* ▼ MUIアイコンコンポーネントを使用 */}
          <HomeIcon />
          <span>ホーム</span>
        </NavLink>
        <NavLink to="/post" className="nav-item">
          <AddCircleOutlineIcon />
          <span>投稿</span>
        </NavLink>
        <NavLink to="/mypage" className="nav-item">
          <AccountCircleIcon />
          <span>マイページ</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Layout;