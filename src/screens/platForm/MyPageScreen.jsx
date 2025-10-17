import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Linkをインポート
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Box, Tabs, Tab } from "@mui/material";

// 投稿一覧を表示するための共通コンポーネント
const WorksGrid = ({ works }) => {
  if (works.length === 0) {
    return <p>投稿はありません。</p>;
  }
  return (
    <div className="liked-images-grid">
      {works.map((work) => (
        // ▼▼▼ Linkコンポーネントで画像を囲む ▼▼▼
        <Link to={`/work/${work.work_id}`} key={work.work_id}>
          <img
            src={work.url}
            alt={work.title}
            className="liked-image-thumbnail"
          />
        </Link>
      ))}
    </div>
  );
};

function MyPageScreen() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [likedWorks, setLikedWorks] = useState([]);
  const [myWorks, setMyWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        if (tabValue === 0) {
          // --- 「いいね」タブのデータ取得 ---
          const { data: userLikes, error: likesError } = await supabase
            .from("likes")
            .select("work_id")
            .eq("user_id", currentUser.id);
          if (likesError) throw likesError;
          const likedWorkIds = userLikes.map((like) => like.work_id);
          if (likedWorkIds.length > 0) {
            const { data: worksData, error: worksError } = await supabase
              .from("works")
              .select("*")
              .in("work_id", likedWorkIds);
            if (worksError) throw worksError;
            setLikedWorks(worksData);
          } else {
            setLikedWorks([]);
          }
        } else if (tabValue === 1) {
          // --- 「自分の投稿」タブのデータ取得 ---
          const { data, error } = await supabase
            .from("works")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false });
          if (error) throw error;
          setMyWorks(data);
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, tabValue]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウトに失敗しました", error);
    } else {
      navigate("/login");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div
      className="screen-container"
      style={{ justifyContent: "flex-start", paddingTop: "20px", gap: "20px" }}
    >
      <h1>マイページ</h1>
      {currentUser && <p>ようこそ, {currentUser.email} さん</p>}

      <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="いいね" />
          <Tab label="自分の投稿" />
        </Tabs>
      </Box>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <>
          {tabValue === 0 && <WorksGrid works={likedWorks} />}
          {tabValue === 1 && <WorksGrid works={myWorks} />}
        </>
      )}

      <button
        onClick={handleLogout}
        className="button"
        style={{ backgroundColor: "#888", marginTop: "auto" }}
      >
        ログアウト
      </button>
    </div>
  );
}

export default MyPageScreen;
