import asyncio
import threading
import traceback
from dotenv import load_dotenv
import os
from flask_cors import CORS
from flask_limiter.util import get_remote_address
from flask import Flask, jsonify, render_template, request
from app.storege.ranking_manager import fetch_ranking
from app.storege.ranking_manager import fetch_ranking
from app.routes.user_router import user_bp
from app.routes.server_router import auth_bp

from app.config import config, app, client, ranking_cache

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

CORS(app, resources={r"/*": {"origins": "*"}})  # セキュリティ意識高めでいこう


async def ranking_init():
    try:
        print("ランキングのキャッシュを初期化します.....")
        ranking_cache.clear()
        for level in ["short", "normal", "long"]:
            ranking_cache[level] = await fetch_ranking.fetch_ranking_from_db_to_list(
                level
            )
    except Exception:
        traceback.print_exc()
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


async def start_ranking_init():
    while True:
        await ranking_init()
        traceback.print_exc()
        asyncio.sleep(config.RANKING_RELOAD_INTERVAL)


def run_asyncio_task():
    asyncio.run(start_ranking_init())


with app.app_context():
    asyncio.run(ranking_init())


if __name__ == "__main__":
    # use_reloader=Falseにしないと2回起動してしまう(ranking_initも呼び出される時に２回呼び出される)
    app.run(
        debug=True, host="0.0.0.0", port=config.PORT
    )  # デバッグモード(True)  # 本番環境ではFalse(セキュリティ上の問題)&
    threading.Thread(target=run_asyncio_task).start()
