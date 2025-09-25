import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# Define the response model for the root endpoint
class HelloResponse(BaseModel):
    message: str


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
@app.get("/imgs")
def get_all_imgs():
    # DBできたらここで全件取得
    # リストで返す？
    return {
        "imgs": []
    }