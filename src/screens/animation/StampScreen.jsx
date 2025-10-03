import React from "react";
import { Link } from "react-router-dom";

function  StampScreen() {
  return (
    <div className="screen-container">
      <h1>ようこそ！</h1>
      <Link to="/login" className="button">
        ログイン
      </Link>
      <Link to="/register" className="button">
        新規登録
      </Link>
    </div>
  );
}

export default StampScreen;
