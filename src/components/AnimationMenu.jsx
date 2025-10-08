import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Brush";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PhotoFrameIcon from "@mui/icons-material/Photo";

function AnimationMenu() {
  const location = useLocation(); // 現在のパスを取得して、アクティブ表示用に使用

  const menuItems = [
    { path: "sketch", label: "落書き", icon: <HomeIcon /> },
    { path: "stamp", label: "スタンプ", icon: <EmojiEmotionsIcon /> },
    { path: "frameMotion", label: "囲って", icon: <CropSquareIcon /> },
    { path: "effect", label: "エフェクト", icon: <AutoAwesomeIcon /> },
    { path: "frame", label: "フレーム", icon: <PhotoFrameIcon /> },
  ];

  return (
    <div style={styles.container}>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            ...styles.link,
            color: location.pathname.includes(item.path) ? "#ff80aa" : "#fff",
          }}
        >
          <div style={styles.icon}>{item.icon}</div>
          <span style={styles.label}>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "70px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#333",
    borderTop: "2px solid #555",
    zIndex: 1000,
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  icon: {
    fontSize: "24px",
  },
  label: {
    marginTop: "4px",
  },
};

export default AnimationMenu;
