import React, { useEffect, useRef, useState } from "react";

import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AddIcon from "@mui/icons-material/Add";
import { RouterProvider } from "react-router-dom";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";

function AnimationHomeScreen() {
  return (
     <div className="screen-container">
       <Link to="/animation" className="button" style={{ backgroundColor: "#888" }}></Link>
      <h1>アニメーションのホーム画面</h1>
      <p>この画面は現在準備中です。</p>
      {/* ログアウト機能を想定 */}
      <Link to="/auth" className="button" style={{ backgroundColor: "#888" }}>
        ログアウト
      </Link>
    </div>
  );
}

export default AnimationHomeScreen;

