import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
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
    NEVER_GONNA_GIVE_YOU_UP_URL = os.getenv("NEVER_GANNA_GIVE_YOU_UP_URL")
    PIECE = os.getenv("PIECE")

    GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", None)
    GITHUB_ACCESS_TOKEN_RTL = "https://github.com/login/oauth/access_token"
    GITHUB_AUTHORIZATION_RL = "https://github.com/login/oauth/authorize"
    GITHUB_API_BASE_URL= "https://api.github.com/"
    GITHUB_REDIRECT_URL = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=user:email"


    ERROE_MESSAGE = "エラーが発生しました、、、"
    USER_NOT_FOUND_MESSAGE = "ユーザーが見つかりません"
    USER_ALREADY_EXISTS_MESSAGE = "ユーザーが既に存在しています"
    USER_CREATED_MESSAGE = "ユーザーが作成されました"
    INVALID_TOKEN_MESSAGE = "ん？......"
    TOKEN_NOT_FOUND_MESSAGE = "ログインし直してください....ごめんぴょ"
    TOKEN_OWNER_NOT_FOUND_MESSAGE = "ログインし直してください....ごめんぴょ"
    TOKEN_TIMEOUT_MESSAGE = "ログインし直してください....ごめんぴょ"
    FAILED_TO_AUTH_MESSAGE = "認証に失敗しました🙁"
    SESSION_TIMEOUT_MESSAGE = "セッションが途切れました"
    TOO_MUCH_REQEST_MESSAGE =  "ちょ、ちょ、っま、、、あ"

db = MongoClient(config.MONGO_URL)[config.MONGO_DB_NAME]

def create_app() -> Flask:
    from app.routes.user_router import user_bp, github_bp, verify_bp

    app = Flask(__name__)
    app.config.from_object(config)
    client = MongoClient(config.MONGO_URL)
    app.config['RATELIMIT_HEADERS_ENABLED'] = True

    # リクエスト回数の制限
    # limiter = Limiter(
    #     get_remote_address,
    #     app=app,
    #     default_limits=["200 per day", "50 per hour" , "15 per minutes"],
    #     # storage_uri="memory://",
    # )

    app.register_blueprint(github_bp, url_prefix="/github")
    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(verify_bp , url_prefix="/verify")
    try:
        client.admin.command("ismaster")
        print("MongoDB connection successful")
    except Exception as e:
        print("MongoDB connection failed", e)
    CORS(app, resources={r"/*": {"origins": "*"}})  # セキュリティ意識高めでいこう
    return app
