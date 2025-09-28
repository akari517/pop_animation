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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layoutコンポーネントを使い、共通のタブバーを表示するルート */}
        <Route path="/" element={<Layout />}>
          <Route index element={<ViewingScreen />} />
          <Route path="home" element={<ViewingScreen />} />
          <Route path="post" element={<PostScreen />} />
          {/* MyPageは後で保護対象にします */}
          <Route
            path="mypage"
            element={
              <ProtectedRoute>
                <MyPageScreen />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* タブバーなしの独立した画面 */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
