from dotenv import load_dotenv
import os
from pymongo.common import partition_node
import schedule
from pymongo import MongoClient
from flask_limiter.util import get_remote_address
from flask import Flask, jsonify, render_template, request
from flask_limiter import Limiter
from app.storege.ranking_manager import fetch_ranking
import asyncio
from app.config import config , app , client , ranking_cache
from app.storege.ranking_manager import fetch_ranking
from app.routes.user_router import user_bp
from app.routes.server_router import auth_bp

# 本番環境で変更すること
# cookieの設定(Secure HTTPOnly)
# scrf対策

dotenv_path = os.path.join(os.path.dirname(__file__), ".", ".env")
load_dotenv(dotenv_path)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/user")
try:
    client.admin.command("ismaster")
    print("MongoDB connection successful")

except Exception as e:
    print("MongoDB connection failed", e)

# CORS(app, resources={r"/*": {"origins": "*"}})  # セキュリティ意識高めでいこう

# ランキングのキャッシュの初期化のスケジューリング
# キャッシュの初期化 -> キャッシュはこの中で宣言する
async def cache_init_ins():
    print("ランキングのキャッシュを初期化します.....")
    try:
        ranking_cache.clear()
        for level in ["short", "normal", "long"]:
            ranking_cache[level] = await fetch_ranking.fetch_ranking_from_db_to_list(level)
        print(ranking_cache["short"], "\n" ,  ranking_cache["normal"] ,"\n", ranking_cache["long"])
        print("ランキングのキャッシュの初期化が完了しました" , "ショートの長さ" , len(ranking_cache["short"]) , "ノーマルの長さ" , len(ranking_cache["normal"]) , "ロングの長さ" , len(ranking_cache["long"]))
    except Exception as e:
       print(e)
       print("ランキングのキャッシュの初期化に失敗しました")



# @app.errorhandler(429)
def ratelimit_handler():
    ip_address = request.remote_addr
    return jsonify({"message": "dipshit"}), 429

@app.route("/", methods=["GET"])
def index():
    # access_token = request.cookies.get("access_token")
    # refresh_token = request.cookies.get("refresh_token")
    # if access_token and refresh_token is None:
    #     return render_template("index.html")
    return render_template("index.html")



if __name__ == "__main__":
    asyncio.run(cache_init_ins())
    schedule.every(10).seconds.do(lambda: asyncio.run(cache_init_ins()))
    while True:
        schedule.run_pending()
    app.run(
        debug=True, host="0.0.0.0", port=config.PORT
    )  # デバッグモード(True)  # 本番環境ではFalse(セキュリティ上の問題)
