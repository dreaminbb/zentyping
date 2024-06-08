import os
from flask import Response, request, url_for
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from authlib.integrations.flask_client import OAuth
from bson.objectid import ObjectId
import json
from bson import json_util
from waitress import serve

app = Flask(__name__)
CORS(origins="http://localhost:5173")

client = MongoClient("mongodb://localhost:27017/")

port = os.getenv("PORT", 8000)
db = client["mode-typing-problem-db"]
short_collection = db.short
normal_collection = db.normal
long_collection = db.long

# .envファイルを読み込む
try:
    dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
except Exception as e:
    print("Failed to load .env file in main", e)
load_dotenv(dotenv_path)


# APIがデーターベースに接続
try:
    client.admin.command("ismaster")
    print("MongoDB connection successful in main")
except Exception as e:
    print("MongoDB connection failed in main", e)


@app.route("/get_problem", methods=["GET"])
def get_problem():
    try:
        client_key = request.headers.get("Authorization")
        server_key = os.getenv("SERVER_GET_PROBLEM_API_KEY")

        piece = int(os.getenv("piece", 5))

        if client_key == server_key:
            short_doc = [
                json.loads(json_util.dumps(document))
                for document in db["short"].aggregate([{"$sample": {"size": piece}}])
            ]
            normal_doc = [
                json.loads(json_util.dumps(document))
                for document in db["normal"].aggregate([{"$sample": {"size": piece}}])
            ]
            long_doc = [
                json.loads(json_util.dumps(document))
                for document in db["long"].aggregate([{"$sample": {"size": piece}}])
            ]

            return Response(
                json.dumps([short_doc, normal_doc, long_doc], ensure_ascii=False),
                mimetype="application/json",
            )

        else:
            return jsonify({"error": "Invalid API key"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# OAuthクライアントの設定
oauth = OAuth(app)
oauth.register(
    name="github",
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url="https://github.com/login/oauth/access_token",
    access_token_params=None,
    authorize_url="https://github.com/login/oauth/authorize",
    authorize_params=None,
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "user:email"},
)


# githubでサインイン
@app.route("/login/githu")
def login_github():
    redirect_uri = url_for("authorize_github", _external=True)
    return oauth.github.authorize_refurect(redirect_uri)


@app.route("/authorize/github")
def authorize_github():
    token = oauth.github.authorize_access_token()
    resp = oauth.github.get("user", token=token)
    user_info = resp.json
    return jsonify(user_info)


if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=port)  # 本番環境ではFalse(セキュリティ上の問題)
