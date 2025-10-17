// src/screens/animation/SketchScreen.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AnimationContext } from "../../context/AnimationContext";
import { Stage, Layer, Line, Circle } from "react-konva";
import { Box, Button, useMediaQuery } from "@mui/material";
import { supabase } from "../../supabaseClient.js";
import { getLineProps } from "./PenTools";
import URLImage from "../../components/URLImage.jsx";
import { useStageSize } from "../../components/useStageSize.jsx";

const penTypes = [
  { value: "pen", label: "ノーマル" },
  { value: "neon", label: "ネオン" },
  { value: "glitter", label: "キラキラ" },
  { value: "transparent", label: "透明" },
  { value: "circle", label: "丸" },
  { value: "balloon", label: "風船" },
  { value: "jellyfish", label: "クラゲ" },
  { value: "eraser", label: "消しゴム" },
];

const colors = [
  "#ffb6c1","#ffc0cb","#ff69b4","#ff1493","#ff4500",
  "#ffa500","#ffff00","#adff2f","#00fa9a","#00ced1",
  "#1e90ff","#9370db","#ffffff","#cccccc","#000000"
];

const SketchScreen = () => {
  const { workId } = useParams(); // ここでURLパラメータ取得
  const isDrawing = useRef(false);
  const { selectedImage, currentShapes, pushShapeHistory, undo, redo, clear, tool, setTool, color, setColor } = useContext(AnimationContext);

  const [toolLocal, setToolLocal] = useState(tool || "pen");
  const [colorLocal, setColorLocal] = useState(color || "#ffb6c1");
  const stageSize = useStageSize(70);
  const isMobile = useMediaQuery("(max-width:600px)");
  const toolbarHeight = isMobile ? 240 : 180;
  const contentHeight = Math.max(100, stageSize.height - toolbarHeight);

  const startDrawing = (pos) => {
    isDrawing.current = true;
    pushShapeHistory([...currentShapes, { points: [pos.x, pos.y], color: colorLocal, tool: toolLocal }]);
  };

  const drawMove = (pos) => {
    if (!isDrawing.current) return;
    const shapes = [...currentShapes];
    const lastIdx = shapes.length - 1;
    shapes[lastIdx] = { ...shapes[lastIdx], points: [...shapes[lastIdx].points, pos.x, pos.y] };
    pushShapeHistory(shapes);
  };

  const endDrawing = () => { isDrawing.current = false; };
  const getPointerPos = (e) => e.target.getStage().getPointerPosition();
  const handleDown = (e) => startDrawing(getPointerPos(e));
  const handleMove = (e) => drawMove(getPointerPos(e));

  useEffect(() => {
    const handleGlobalUp = () => (isDrawing.current = false);
    document.addEventListener("mouseup", handleGlobalUp);
    document.addEventListener("touchend", handleGlobalUp);
    return () => {
      document.removeEventListener("mouseup", handleGlobalUp);
      document.removeEventListener("touchend", handleGlobalUp);
    };
  }, []);

  // -------------------- Supabaseロード --------------------
  const handleLoadLatest = async () => {
    if (!workId) return;
    const { data, error } = await supabase
      .from("animations")
      .select("animation_data")
      .eq("work_id", workId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (error) console.error("読み込み失敗:", error);
    else if (data?.animation_data) pushShapeHistory(data.animation_data);
  };

  useEffect(() => { handleLoadLatest(); }, [workId]); // workIdが変わるたびロード

  const handleSave = async () => {
    if (!workId) return alert("workIdが未設定です");
    const { error } = await supabase
      .from("animations")
      .insert([{ work_id: workId, animation_data: currentShapes, created_at: new Date().toISOString() }]);
    if (error) alert("保存失敗: " + error.message);
    else alert("保存しました！");
  };

  return (
    <Box width="100%" height="100vh" display="flex" flexDirection="column" bgcolor="#fcfffdff" sx={{ overflow:"hidden", position:"relative" }}>
      <Box sx={{ height: `${contentHeight}px`, display:"flex", justifyContent:"center", alignItems:"flex-start", position:"relative" }}>
        <Stage
          width={stageSize.width}
          height={contentHeight}
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={endDrawing}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={endDrawing}
        >
          <Layer>{selectedImage && <URLImage src={selectedImage} stageWidth={stageSize.width} stageHeight={contentHeight} />}</Layer>
          <Layer>
            {currentShapes.map((shape,i) => {
              const props = getLineProps(shape);
              if (shape.tool==="balloon"||props.balloon){
                return shape.points.reduce((arr,_,idx)=>{
                  if(idx%2===0){
                    arr.push(<Circle key={`balloon-${i}-${idx}`} x={shape.points[idx]} y={shape.points[idx+1]} radius={6+Math.random()*6} fill={props.fill||shape.color} shadowBlur={props.shadowBlur||8} shadowColor={props.shadowColor||"#fff"} opacity={props.opacity||0.8}/>);
                  }
                  return arr;
                },[]);
              }
              if(shape.tool==="glitter"){
                return <React.Fragment key={i}><Line {...props}/>{shape.points.reduce((arr,_,idx)=>{if(idx%2===0) arr.push(<Circle key={`g-${i}-${idx}`} x={shape.points[idx]} y={shape.points[idx+1]} radius={Math.random()*2+1} fill="#fffacd" opacity={Math.random()}/>); return arr;},[])}</React.Fragment>
              }
              if(shape.tool==="neon"){
                return <React.Fragment key={i}><Line points={shape.points} stroke={shape.color} strokeWidth={12} lineCap="round" lineJoin="round" tension={0.5} opacity={0.4}/><Line {...props}/></React.Fragment>
              }
              return <Line key={i} {...props}/>
            })}
          </Layer>
        </Stage>
      </Box>

      {/* ツールバー */}
      <Box sx={{ position:"fixed", bottom:"70px", left:0, width:"100%", height:`${toolbarHeight}px`, background:"white", borderTop:"2px solid #D6F4DE", boxShadow:"0 -2px 10px rgba(255,182,193,0.2)", borderRadius:"20px 20px 0 0", p:2, zIndex:1100, overflowY:"auto" }}>
        <Box display="flex" overflow="auto" gap={2} mb={2} px={1}>
          {penTypes.map((p)=>(
            <Button key={p.value} onClick={()=>{setToolLocal(p.value); setTool(p.value)}} variant={toolLocal===p.value?"contained":"outlined"} sx={{ minWidth:80, borderRadius:"16px", backgroundColor:toolLocal===p.value?"#D6F4DE":"white", color:toolLocal===p.value?"#2b5f39ff":"#555" }}>{p.label}</Button>
          ))}
        </Box>
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {colors.map((c)=>(
            <Box key={c} onClick={()=>{setColorLocal(c); setColor(c)}} sx={{ width:28, height:28, borderRadius:"50%", backgroundColor:c, cursor:"pointer", border: colorLocal===c?"3px solid #17f051ff":"2px solid white", boxShadow: colorLocal===c?"0 0 8px #90eea9ff":"0 0 4px #ddd", transition:"0.2s"}} />
          ))}
        </Box>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button onClick={undo} size="small" sx={{borderRadius:"12px"}}>↩️ Undo</Button>
          <Button onClick={redo} size="small" sx={{borderRadius:"12px"}}>↪️ Redo</Button>
          <Button onClick={clear} color="error" variant="contained" size="small" sx={{borderRadius:"12px"}}>🧼 Clear</Button>
          <Button onClick={handleSave} color="success" variant="contained" size="small" sx={{borderRadius:"12px"}}>💾 Save</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SketchScreen;
