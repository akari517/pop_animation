import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import HomeIcon from "@mui/icons-material/Brush";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PhotoFrameIcon from "@mui/icons-material/Photo";
import { AnimationContext } from "../context/AnimationContext";
import { useAuth } from "../context/AuthContext";

function AnimationMenu() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { saveAnimation } = useContext(AnimationContext);

  const menuItems = [
    { path: "sketch", label: "落書き", icon: <HomeIcon /> },
    { path: "stamp", label: "スタンプ", icon: <EmojiEmotionsIcon /> },
    { path: "motion", label: "囲ってモーション", icon: <CropSquareIcon /> },
    { path: "effect", label: "エフェクト", icon: <AutoAwesomeIcon /> },
    { path: "frame", label: "フレーム", icon: <PhotoFrameIcon /> },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.link,
              color: location.pathname.includes(item.path) ? "#4CAF50" : "#fff",
            }}
          >
            <div style={styles.icon}>{item.icon}</div>
            <span style={styles.label}>{item.label}</span>
          </Link>
        ))}
      </div>
      <div style={styles.saveContainer}>
        <button style={styles.saveButton} onClick={() => saveAnimation(currentUser?.id)}>
          💾 保存
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 1000 },
  container: { display: "flex", justifyContent: "space-around", alignItems: "center", backgroundColor: "#333", borderTop: "2px solid #555", height: "70px" },
  link: { flex: 1, textDecoration: "none", color: "#fff", fontSize: "12px", display: "flex", flexDirection: "column", alignItems: "center" },
  icon: { fontSize: "24px" },
  label: { marginTop: "4px" },
  saveContainer: { backgroundColor: "#222", textAlign: "center", padding: "8px 0", borderTop: "1px solid #555" },
  saveButton: { backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "14px", cursor: "pointer" },
};

export default AnimationMenu;
