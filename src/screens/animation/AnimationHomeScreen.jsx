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
  const [selectedImage, setSelectedImage] = useState(null);

  // 画像選択時
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  // 編集完了ボタン押下時
  const handleComplete = () => {
    if (!selectedImage) {
      alert("画像を選択してください");
      return;
    }
    alert("編集完了！選択画像URL: " + selectedImage);
  };

  return (
    <div className="screen-container">
      <h1>アニメーション画面</h1>

      {/* 見出しの下で左右端にボタン配置 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
          mb: 2,
          width: "100%",
        }}
      >
        {/* 左端：画像選択 */}
        <input
          accept="image/*"
          type="file"
          id="image-upload"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <label htmlFor="image-upload">
          <Button variant="contained" component="span">
            画像選択
          </Button>
        </label>

        {/* 右端：編集完了 */}
        <Button variant="contained" color="primary" onClick={handleComplete}>
          編集完了
        </Button>
      </Box>

      {/* 選択画像プレビュー */}
      {selectedImage && (
        <Box mb={2} textAlign="center">
          <img
            src={selectedImage}
            alt="selected"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        </Box>
      )}

      {/* 既存の Outlet と AnimationMenu */}
      <Outlet />
      <AnimationMenu />
    </div>
  );
}

export default AnimationHomeScreen;