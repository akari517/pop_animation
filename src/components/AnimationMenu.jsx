import { Link } from 'react-router-dom';

// import image2 from "../../assets/image4.jpg";

function AnimationMenu() {
  return (
    <div>
      <p>下のメニューから機能を選んでね！</p>
      <Link to="sketch" className="button" style={{ backgroundColor: "#888" }}>
        落書き画面
      </Link>
      <Link to="stamp" className="button" style={{ backgroundColor: "#888" }}>
        スタンプ画面
      </Link>
      <Link to="frameMotion" className="button" style={{ backgroundColor: "#888" }}>
        囲ってモーション画面
      </Link>
      <Link to="effect" className="button" style={{ backgroundColor: "#888" }}>
        エフェクト画面
      </Link>
      <Link to="frame" className="button" style={{ backgroundColor: "#888" }}>
        フレーム画面
      </Link>
    </div>
  );
}

export default AnimationMenu;