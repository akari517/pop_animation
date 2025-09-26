import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# Define the response model for the root endpoint
class HelloResponse(BaseModel):
    message: str

# DB保存リクエスト
class ImageRecordRequest(BaseModel):
    s3_url: str
    user_id: int

# Initialize the FastAPI app
app = FastAPI()

# Configure logging for the app
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


# Define the root endpoint
@app.get("/", response_model=HelloResponse)
def hello():
    return HelloResponse(**{"message": "Hello, world!"})


# 画像一覧取得エンドポイント
@app.get("/images")
def get_all_images():
    # DBできたらここで全件取得
    # リストで返す？
    return {
        "images": []
    }
    
    
# 画像取得エンドポイント
@app.get("/images/{image_id}")
def get_image_by_id(image_id: int):
    # DBできたらここで取得
    return {
        "id": image_id
    }

# DB保存エンドポイント
@app.post("/img/save")
def save_img_url(req: ImageRecordRequest):
    try:
        # debug用
        # DBできたらここでDBに保存
        print(f"url: {req.s3_url}, user: {req.user_id}")
        return {
            "message": "image_url saved successfully"
        }
    except Exception as e:
        return {
            "message": f"failed to save image_url: {str(e)}"
        }
        
