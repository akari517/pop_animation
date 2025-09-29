import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

function MyPageScreen() {
  const { currentUser } = useAuth(); // session.userでも可
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウトに失敗しました", error);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="screen-container">
      <h1>マイページ</h1>
      {currentUser ? (
        <>
          <p>ようこそ, {currentUser.email} さん</p>
          <button
            onClick={handleLogout}
            className="button"
            style={{ backgroundColor: "#888" }}
          >
            ログアウト
          </button>
        </>
      ) : (
        <p>ログインしていません。</p>
      )}
    </div>
  );
}

export default MyPageScreen;
