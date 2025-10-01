import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import psycopg2

# 環境変数読み込み
load_dotenv()

# ルートエンドポイントのレスポンスモデル
class HelloResponse(BaseModel):
    message: str

# DB保存リクエスト
# TODO: schema決まったら修正
class WorkRecordRequest(BaseModel):
    s3_url: str
    user_id: int

app = FastAPI()

logger = logging.getLogger("uvicorn")
logger.level = logging.INFO

# Configure CORS to allow requests from the frontend
origins = [os.environ.get("FRONT_URL", "http://localhost:3000")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


def get_db_connection():
    """
    新しい psycopg2 接続を返す。呼び出し側で必ず close() 必要。
    .env の小文字キー (user,password,host,port,dbname) を想定。
    Supabase pooler を使う場合は sslmode='require' を付与します。
    """
    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port", "5432")
    DBNAME = os.getenv("dbname")

    if not all([USER, PASSWORD, HOST, PORT, DBNAME]):
        raise RuntimeError("環境変数が不足しています。user/password/host/port/dbname を設定してください。")

    try:
        return psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME,
            sslmode="require",
            connect_timeout=10
        )
    except Exception as e:
        raise RuntimeError(f"データベースに接続できませんでした: {e}")



def get_all_works_from_db():
    """
    DBから全件取得する関数。
    """
    conn = get_db_connection()
    
    # TODO: クエリは修正
    query = """
    SELECT * FROM XXX;
    """
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()
            # TODO: schema決まったら修正
            works_list = [{"name": name, "category": category, "work_name": work_name} for name, category, work_name in rows]
            result = {"works": works_list}
            return result
    finally:
        conn.close()
    
    



# ルートエンドポイント
@app.get("/", response_model=HelloResponse)
def hello():
    return HelloResponse(**{"message": "Hello, world!"})


# 画像一覧取得エンドポイント
@app.get("/works")
def get_all_works():
    return get_all_works_from_db()


# 画像取得エンドポイント
@app.get("/works/{work_id}")
def get_work_by_id(work_id: int):
    # DBできたらここで取得
    return {
        "id": work_id
    }

# DB保存エンドポイント
@app.post("/img/save")
def save_img_url(req: WorkRecordRequest):
    try:
        # debug用
        # DBできたらここでDBに保存
        print(f"url: {req.s3_url}, user: {req.user_id}")
        return {
            "message": "work_url saved successfully"
        }
    except Exception as e:
        return {
            "message": f"failed to save work_url: {str(e)}"
        }

