import os
from flask import Response, request, url_for, redirect, Blueprint
from flask import Flask, jsonify
import requests
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from bson import json_util
from authlib.integrations.flask_client import OAuth
import json
from waitress import serve


app = Flask(__name__)
CORS(app, origins="http://localhost:5173")  # セキュリティ意識高めでいこう

client = MongoClient("mongodb://localhost:27017/")
port = int(os.getenv("PORT", 8000))
db = client["mode-typing-problem-db"]
short_collection = db.short
normal_collection = db.normal
long_collection = db.long

# .envファイルを読み込む
try:
    dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
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


github_client_id = os.getenv("GITHUB_CLIENT_ID")
redirect_url = f"https://github.com/login/oauth/authorize?client_id={github_client_id}&scope=user:email"


@app.route("/github_sign_redirect")
def github_sign_redirect():
    return redirect(redirect_url)


@app.route("/callback")
def github_callback():

    code = request.args.get("code")
    if not code:
        return "認証コードが見つかりません"  # エラーページへとリダイレクト

    token_response = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": os.getenv("GITHUB_CLIENT_ID"),
            "client_secret": os.getenv("GITHUB_CLIENT_SECRET"),
            "code": code,
        },
    )
    # output {'access_token': 'thisistheexampleoftoken ', 'token_type': 'bearer', 'scope': ''}

    access_token = token_response.json()["access_token"]

    if not access_token:
        return "アクセストークンが見つかりません", 400

    # # トークンを用いてユーザー情報を取得

    user_response = requests.get(
        "https://api.github.com/user",
        headers={
            "Authorization": f"token {access_token}",
        },
    )

    if user_response.status_code != 200:
        return "ユーザー情報が見つかりません", 400, user_response.status_code

    email_response = requests.get(
        "https://api.github.com/user/emails",
        headers={
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github.v3+json",
        },
    )

    # primary emailを取得
    if email_response.status_code != 200:
        return "メールアドレスが見つかりません", 400, email_response.status_code

    user_response = requests.get(
        "https://api.github.com/user",
        headers={
            "Authorization": f"token {access_token}",
        },
    )

    if user_response.status_code != 200:
        return "ユーザー情報が見つかりません", 400, user_response.status_code

    email_response = requests.get(
        "https://api.github.com/user/emails",
        headers={
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github.v3+json",
        },
    )

    # primary emailを取得
    if email_response.status_code != 200:
        return "メールアドレスが見つかりません", 400, email_response.status_code

    user_email = email_response.json()[0]["email"]

    return user_email


# ↓ユーザー認証　情報取得のコードを色々
# ユーザー認証が成功しなかった場合エラーで返す


if __name__ == "__main__":
    # serve(app, host="0.0.0.0", port=port)  # 本番環境ではFalse(セキュリティ上の問題)
    app.run(debug=True, host="0.0.0.0", port=port)
