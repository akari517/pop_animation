import { createBrowserRouter } from "react-router-dom";

// 各ページコンポーネントのインポート
import AuthScreen from "../screens/platForm/AuthScreen";
import LoginScreen from "../screens/platForm/LoginScreen";
import RegisterScreen from "../screens/platForm/RegisterScreen";
import ViewingScreen from "../screens/platForm/ViewingScreen";
import PostScreen from "../screens/platForm/PostScreen";
import FavoritesScreen from "../screens/platForm/FavoritesScreen";
import MyPageScreen from "../screens/platForm/MyPageScreen";
import Layout from "../components/Layout";
import TestPostScreen from "../screens/platForm/TestPostScreen";
import DetailScreen from "../screens/platForm/DetailScreen";

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
      {
        path: "post",
        Component: () => (
          <RequireAuth isAuthenticated={isAuthenticated}>
            <PostScreen />
          </RequireAuth>
        ),
      },

      { path: "favorites", Component: FavoritesScreen },
      { path: "mypage", Component: MyPageScreen },
      { path: "test_post", Component: TestPostScreen },
    ],
  },
  { path: "/work/:workId", element: <DetailScreen /> },
  // 未定義のルートは "/" にリダイレクト
  { path: "*", Component: () => <Navigate to="/" /> },
]);
