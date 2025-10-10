import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { Outlet } from "react-router-dom";
import AnimationMenu from "../../components/AnimationMenu";
import { AnimationContext } from "../../context/AnimationContext";
function AnimationHomeScreen() {
  const { selectedImage, setSelectedImageFromFile } = useContext(AnimationContext);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageFromFile(file);
    }
  };

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

      {/* 選択画像のプレビュー
      {selectedImage && (
        <Box mb={2} textAlign="center">
          <img
            src={selectedImage}
            alt="selected"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        </Box>
      )} */}

      {/* Outlet はコンテキストを直接利用するため追加の props は不要 */}
      <Outlet />

      <AnimationMenu />
    </div>
  );
}

export default AnimationHomeScreen;
