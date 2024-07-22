from app import config
from dotenv import load_dotenv
import os
from flask import Flask, render_template
from pymongo import MongoClient
from app.routes.user_router import user_bp, github_bp, verify_bp

# 本番環境で変更すること
# cookieの設定(Secure HTTPOnly)
# scrf対策

dotenv_path = os.path.join(os.path.dirname(__file__), ".", ".env")
load_dotenv(dotenv_path)

app = Flask(
    __name__,
    template_folder="app/template/dist",
    static_folder="app/template/dist/assets",
)
app.config.from_object(config)
client = MongoClient(config.MONGO_URL)
app.config["RATELIMIT_HEADERS_ENABLED"] = True
# リクエスト回数の制限
# limiter = Limiter(
#     get_remote_address,
#     app=app,
#     default_limits=["200 per day", "50 per hour" , "15 per minutes"],
#     # storage_uri="memory://",
# )
app.register_blueprint(github_bp, url_prefix="/github")
app.register_blueprint(user_bp, url_prefix="/user")
app.register_blueprint(verify_bp, url_prefix="/verify")
# CORS(app, resources={r"/*": {"origins": "*"}})  # セキュリティ意識高めでいこう
try:
    client.admin.command("ismaster")
    print("MongoDB connection successful")
except Exception as e:
    print("MongoDB connection failed", e)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(
        debug=True, host="0.0.0.0", port=config.PORT
    )  # デバッグモード(True)  # 本番環境ではFalse(セキュリティ上の問題)
