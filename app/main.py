from app.config import config
import asyncio
from dotenv import load_dotenv
import os
from flask import Flask, jsonify, render_template, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from pymongo import MongoClient

# 本番環境で変更すること
# cookieの設定(Secure HTTPOnly)
# scrf対策

dotenv_path = os.path.join(os.path.dirname(__file__), ".", ".env")
load_dotenv(dotenv_path)

app = Flask(
    __name__,
    template_folder="template/dist",
    static_folder="template/dist/assets",
)
app.config.from_object(config)
client = MongoClient(config.MONGO_URL)
app.config["RATELIMIT_HEADERS_ENABLED"] = True

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["900 per day", "50 per hour", "1000 per minutes"],
    # storage_uri="memory://",
)

# リクエスト回数の制限
from routes.user_router import user_bp
from routes.server_router import auth_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/user")


# CORS(app, resources={r"/*": {"origins": "*"}})  # セキュリティ意識高めでいこう

# @app.errorhandler(429)
def ratelimit_handler():
    ip_address = request.remote_addr
    return jsonify({"message": "dipshit"}), 429


try:
    client.admin.command("ismaster")
    print("MongoDB connection successful")
except Exception as e:
    print("MongoDB connection failed", e)


@app.route("/", methods=["GET"])
async def index():
    # access_token = request.cookies.get("access_token")
    # refresh_token = request.cookies.get("refresh_token")
    # if access_token and refresh_token is None:
    #     return render_template("index.html")
    return render_template("index.html")