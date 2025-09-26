// src/components/RegisterScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function RegisterScreen() {
  const navigate = useNavigate();

  const handleRegister = () => {
    // 本来はここで登録処理を行う
    console.log("登録処理...");
    navigate("/home"); // 閲覧画面へ遷移
  };

  return (
    <div className="screen-container">
      <h1>新規登録</h1>
      {/* 実際のフォームは省略 */}
      <button onClick={handleRegister} className="button">
        登録する
      </button>
    </div>
  );
}

export default RegisterScreen;
