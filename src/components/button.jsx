import React from "react";
import { Button as MuiButton } from "@mui/material";

const Button = ({ children, onClick, isActiv, type = "default", style }) => {
  return (
    <MuiButton
      onClick={onClick}
      style={style}
      // variantとcolorで切り替え
      variant={isActiv ? "contained" : "outlined"}
      color={type === "danger" ? "error" : "primary"} 
      sx={{
        borderRadius: "12px",
        textTransform: "none", // 大文字変換を無効化
        fontWeight: isActiv ? "bold" : "normal",
      }}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
