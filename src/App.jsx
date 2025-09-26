// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 画面コンポーネントのインポート
import AuthScreen from "./components/AuthScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import ViewingScreen from "./components/ViewingScreen";
import PostScreen from "./components/Animation/PostScreen";
import FavoritesScreen from "./components/FavoritesScreen";
import MyPageScreen from "./components/MyPageScreen";
import Layout from "./components/Layout";

function App() {
  // ここでログイン状態を管理することを想定（今回は常にログイン済みとする）
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        {/* 認証関連のルート */}
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" onRegister={() => <Navigate to="/home" />} />

        {/* メイン機能のルート（Layoutコンポーネントでラップ） */}
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/auth" />}
        >
          {/* ▼ 変更点：/home のアクセスを最初の画像のURLにリダイレクト */}
          <Route path="home" element={<Navigate to="/home/image1" />} />

          {/* ▼ 変更点：:imageId というパラメータを受け取れるようにする */}
          <Route path="home/:imageId" element={<ViewingScreen />} />

          {/* ▼ 変更点：indexも最初の画像にリダイレクト */}
          <Route index element={<Navigate to="/home/image1" />} />

          <Route path="home" element={<ViewingScreen />} />
          <Route path="post" element={<PostScreen />} />
          <Route path="favorites" element={<FavoritesScreen />} />
          <Route path="mypage" element={<MyPageScreen />} />
        </Route>

        {/* 未定義のルートはホームへリダイレクト */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
