import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";

// プラットフォームのインポート
import AuthScreen from "../screens/platForm/AuthScreen";

import LoginScreen from "../screens/platForm/LoginScreen";
//import RegisterScreen from "../screens/platForm/RegisterScreen";
import ViewingScreen from "../screens/platForm/ViewingScreen";
import PostScreen from "../screens/platForm/PostScreen";
import FavoritesScreen from "../screens/platForm/FavoritesScreen";
import MyPageScreen from "../screens/platForm/MyPageScreen";
import Layout from "../components/Layout";
//import TestPostScreen from "../screens/platForm/TestPostScreen";

//アニメーションのインポート
import AnimationHomeScreen from "../screens/animation/AnimationHomeScreen";
import SketchScreen from "../screens/animation/SketchScreen";
import StampScreen from "../screens/animation/StampScreen";
import FrameMotionScreen from "../screens/animation/FrameMotionScreen";
import EffectScreen from "../screens/animation/EffectScreen";
import FrameScreen from "../screens/animation/FrameScreen";


// 認証状態の管理（認証していない）
const isAuthenticated = false;

// ルーティング定義をオブジェクトの配列として作成
export const router = createBrowserRouter([
  //認証関係スクリーン
  { path: "/auth", Component: AuthScreen },
  { path: "/login", Component: LoginScreen },

  //mainスクリーン
  {
    path: "/", //親ルート
    Component: Layout,
    children: [
      { index: true, Component: ViewingScreen }, // "/" にアクセス → ViewingPage
      { path: "home", Component: ViewingScreen },
      { path: "post", Component: PostScreen },
      // {
      //   path: "post",
      //   Component: () => (
      //     <RequireAuth isAuthenticated={isAuthenticated}>
      //       <PostScreen />
      //     </RequireAuth>
      //   ),
      // },

      { path: "favorites", Component: FavoritesScreen },
      { path: "mypage", Component: MyPageScreen },
      { path: "test_post", Component: TestPostScreen },
    ],
  },

  {
    path: "/animation",
    Component: AnimationHomeScreen,
    children: [
      { index: true, Component: AnimationHomeScreen },
      { path: "sketch", Component: SketchScreen },
      { path: "stamp", Component: StampScreen },
      { path: "frameMotion", Component: FrameMotionScreen },
      { path: "effect", Component: EffectScreen },
      { path: "frame", Component: FrameScreen },
    ],
  },

  // 未定義のルートは "/" にリダイレクト
  //TODO: ワイルドカード＊ルートを調べる
  { path: "*", Component: () => <Navigate to="/" /> },
]);