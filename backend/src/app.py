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

        piece = int(os.getenv("PIECE", 5))
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


# ユーザー情報を用いてユーザーのプロフィールを作成
# class user_profile:
#     def __init__(self, user_name, user_email):
#         self.user_name = user_name
#         self.user_email = user_email

#     def create_user(self, user_name, user_email):
#         user_profile = {"user_name": user_name, "user_email": user_email}
#         return user_profile


# githunb認証のクラス
class github_oauth_class:

    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    redirect_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&scope=user:email"

    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token_url = "https://github.com/login/oauth/access_token"
        self.access_token_params = (None,)
        self.authorize_url = "https://github.com/login/oauth/authorize"
        self.authorize_params = (None,)
        self.api_base_url = "https://api.github.com/"
        self.client_kwargs = {"scope": "user:email"}

    # 認証URLを取得
    def get_url(self, scope: str = "user:email"):
        return f"{self.authorize_url}?client_id={self.client_id}&scope={scope}"

    # アクセストークンを取得
    def get_access_token(self, code: str):
        token_response = requests.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "code": code,
            },
        )

        accsess_token = token_response.json()["access_token"]
        if not accsess_token:
            raise ValueError("アクセストークンが見つかりません")

        return accsess_token

    # ユーザー情報を取得
    def get_user_info(self, accsess_token: str) -> dict:
        user_response = requests.get(
            f"{self.api_base_url}user",
            headers={
                "Authorization": f"token {accsess_token}",
            },
        )
        user_name = user_response.json()["login"]

        if not user_name:
            raise ValueError("ユーザー名が見つかりません")

        return user_name

    # ユーザーのメールアドレスを取得
    def get_user_email(self, access_token: str) -> dict:
        email_response = requests.get(
            f"{self.api_base_url}user/emails",
            headers={
                "Authorization": f"token {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )
        user_primary_email = email_response.json()[0]["email"]
        if not user_primary_email:
            raise ValueError("メールアドレスが見つかりません")

        return user_primary_email


client_id = os.getenv("GITHUB_CLIENT_ID")
client_secret = os.getenv("GITHUB_CLIENT_SECRET")
github_oauth = github_oauth_class(client_id, client_secret)


# ユーザーを認証ページへとリダイレクト
@app.route("/github_sign_redirect")
def github_sign_redirect():

    return redirect(github_oauth.get_url())


@app.route("/callback")
def github_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "codeが見つかりません"}), 400
    try:
        access_token = github_oauth.get_access_token(code)
        user_info = github_oauth.get_user_info(access_token)
        user_email = github_oauth.get_user_email(access_token)
    # ユーザー情報をデータベースに保存
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # ユーザー情報をデータベースに保存
    return redirect("http://localhost:5173/userprofile")


# ↓ユーザー認証　情報取得のコードを色々
# ユーザー認証が成功しなかった場合エラーで返す


@app.route("/signup", methods=["POST"])
def signup():
    # ユーザーアカウントが存在しているかを確認
    print(request.json)
    print(type(request.json))
    return "anal"


if __name__ == "__main__":
    # serve(app, host="0.0.0.0", port=port)  # 本番環境ではFalse(セキュリティ上の問題)
    app.run(debug=True, host="0.0.0.0", port=port)
