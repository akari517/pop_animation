import React, { useEffect, useRef, useState } from "react";

import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AddIcon from "@mui/icons-material/Add";
import { RouterProvider } from "react-router-dom";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { Outlet } from 'react-router-dom';
import AnimationMenu from "../../components/AnimationMenu";

function AnimationHomeScreen() {
  return (
    <div className="screen-container">
      <h1>アニメーション画面</h1>
      <Outlet />
      <AnimationMenu />
    </div>
  );
}

export default AnimationHomeScreen;