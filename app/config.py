import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient


class config:
    dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    load_dotenv(dotenv_path)

    URL = os.getenv("URL")
    PORT = int(os.getenv("PORT", 8000))
    MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "mode-typing")
    JWT_SECRET = os.getenv("JWT_SECRET", None)
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", None)
    JWT_EXPIRES_IN = int(os.getenv("JWT_EXPIRES_IN", 30))
    JWT_EXPIRES_IN_REFRESH = int(os.getenv("JWT_EXPIRES_IN_REFRESH", 10))
    SERVER_API_KEY = os.getenv("SERVER_API_KEY", None)
    GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", None)
    NEVER_GONNA_GIVE_YOU_UP_URL = os.getenv("NEVER_GANNA_GIVE_YOU_UP_URL")
    PIECE = os.getenv("PIECE")

    USER_NOT_FOUND_MASSEGE = "ユーザーが見つかりません"
    USER_ALREADY_EXISTS_MASSEGE = "ユーザーが既に存在しています"
    USER_CREATED_MASSEGE = "ユーザーが作成されました"
    INVALID_TOKEN_MASSEGE = "ん？......"
    TOKEN_NOT_FOUND_MASSEGE = "ログインし直してください....ごめんぴょ"
    TOKEN_OWNER_NOT_FOUND_MASSEGE = "ログインし直してください....ごめんぴょ"
    TOKEN_TIMEOUT_MASSEGE = "ログインし直してください....ごめんぴょ"


def create_app() -> Flask:
    from app.routes.user_router import user_bp

    app = Flask(__name__)
    app.config.from_object(config)
    client = MongoClient(config.MONGO_URL)
    app.register_blueprint(user_bp, url_prefix="/user")
    try:
        client.admin.command("ismaster")
        print("MongoDB connection successful")
    except Exception as e:
        print("MongoDB connection failed", e)
    CORS(app, resources={r"/*": {"origins": "*"}})  # セキュリティ意識高めでいこう
    return app
