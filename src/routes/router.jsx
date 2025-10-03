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
import AnimationMenu from "../components/AnimationMenu";


// 認証状態の管理（認証していない）
const isAuthenticated = false;

// ルーティング定義をオブジェクトの配列として作成
export const router = createBrowserRouter([
  //認証関係スクリーン
  { path: "/auth", element: <AuthScreen/> },
  { path: "/login", element:<LoginScreen/> },

  //mainスクリーン
  {
    path: "/", //親ルート
    Component: Layout,
    children: [
      { index: true, element: <ViewingScreen/> }, // "/" にアクセス → ViewingPage
      { path: "home", element: <ViewingScreen/> },
      { path: "post", element: <PostScreen/> },
      // {
      //   path: "post",
      //   Component: () => (
      //     <RequireAuth isAuthenticated={isAuthenticated}>
      //       <PostScreen />
      //     </RequireAuth>
      //   ),
      // },

      { path: "favorites", element: <FavoritesScreen/> },
      { path: "mypage", element: <MyPageScreen/> },
      //{ path: "test_post", Component: TestPostScreen },
    ],
  },

  {
    path: "animation",
    element: <AnimationHomeScreen/>,
    children: [
      { index: true, element: <AnimationMenu/> },
      { path: "sketch", element: <SketchScreen/> },
      { path: "stamp", element: <StampScreen/> },
      { path: "frameMotion", element: <FrameMotionScreen/> },
      { path: "effect", element: <EffectScreen/> },
      { path: "frame", element: <FrameScreen/> },
    ],
  },

  // 未定義のルートは "/" にリダイレクト
  //TODO: ワイルドカード＊ルートを調べる
  { path: "*", element: () => <Navigate to="/" /> },
]);