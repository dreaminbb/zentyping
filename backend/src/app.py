import os
from typing import Tuple
import uuid
from flask import Response, url_for, redirect, Blueprint, make_response, request
from flask import Flask, jsonify
import requests
import hashlib
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import json_util
import json


# 本番環境で変更すること
# Secure
# HTTPOnly

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")  # セキュリティ意識高めでいこう

client = MongoClient("mongodb://localhost:27017/")
db = client["mode-typing"]
port = int(os.getenv("PORT", 8000))

# .envファイルを読み込む
try:
    dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    load_dotenv(dotenv_path)
except Exception as e:
    print("Failed to load .env file in main", e)


# APIがデーターベースに接続

try:
    client.admin.command("ismaster")
    print("MongoDB connection successful in main")
except Exception as e:
    print("MongoDB connection failed in main", e)


# ユーザー情報を削除、更新、セッションの付与、クッキーの付与、(保存方法はサードパーティでもネイティブでも変わらないのでそれぞれで作成する必要なし)
# google analytics cookie を使う
# class user:
#     def __init__(self):
#         self.collection = db["user"]

#     def user_cookie(self, response, user_profile: dict) -> Tuple[Response, int]:

#         # for store user's local storage
#         response.set_cookie("session", "session", secure=True, httponly=True)

#         return print(user_id)

#     def server_cookie(self, user_profile: dict) -> str:

#         # for store user's DB
#         return

#     # for store user's DB


class cookie:

    def __init__(self):
        self.collection = db["cookie"]
        cookie_age = os.getenv("COOKIE_AGE", 60 * 60 * 24 * 7)

    def store_cookie(self, user_profile: dict, cookie_age: int) -> dict:
        cookie = {
            "id": user_profile["_id"],
        }
        return cookie


# github認証
class github_user:
    client_id = os.getenv("GITHUB_CLIENT_ID")
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

        access_token = token_response.json()["access_token"]
        if not access_token:
            raise ValueError("アクセストークンが見つかりません")

        return access_token

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
github_oauth = github_user(client_id, client_secret)


# ユーザーを認証ページへとリダイレクト
@app.route("/github_sign_redirect")
def github_sign_redirect():
    return redirect(github_oauth.get_url())


# todo
# ユーザー情報をデータベースに保存
# ↓ユーザー認証　情報取得のコードを色々
# ユーザー認証が成功しなかった場合エラーで返す


@app.route("/callback")
def github_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "codeが見つかりません"}), 400
    try:
        access_token = github_oauth.get_access_token(code)
        user_info = github_oauth.get_user_info(access_token)
        user_email = github_oauth.get_user_email(access_token)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return redirect("http://localhost:5173/userprofile")


class native_user:

    class cra_user:
        def __init__(self):
            self.collection = db["user"]

        # ここがユーザー情報のエントリーポイント
        def check_email(self, data: dict):
            email = {"email": data["email"]}
            try:
                same_email = self.collection.find_one(email)
            except Exception as e:
                return jsonify({"error": "エラー(::"}, (e)), 500

            if same_email:
                return (
                    jsonify({"massage": "そのメールアドレスは既に登録されています"}),
                    400,
                )

            return

        def check_name(self, data: dict):
            name = {"name": data["name"]}
            try:
                same_name = self.collection.find_one(name)
            except Exception as e:
                return jsonify({"error": "エラー(::"}, (e)), 500

            if same_name:
                return (
                    jsonify({"massage": "そのユーザー名は既に登録されています"}),
                    400,
                )

            return

        def profile(self, data) -> dict:

            if not data:
                return jsonify({"error": "データが見つかりません"}), 400
            salt = os.urandom(32)

            # ここでパスワードをハッシュ化して適切なJSONに変換している
            data["password"] = salt + hashlib.sha256(
                data["password"].encode("utf-8")
            ).hexdigest().encode("utf-8")

            user_id = uuid.uuid4().hex
            # ユーザーIDの生成
            user_profile = {
                "_id": user_id,
                "type": "native",
                "email": data["email"],
                "password": data["password"],
                "name": data["name"],
                # "cookie":
                # cookie_info: {},
                "play_info": {},
            }
            return user_profile

        # ここでデータベースに保存している
        def save_db(self, user_profile: dict):
            try:
                self.collection.insert_one(user_profile)
            except Exception as e:
                return jsonify({"error": str(e)}), 500


# todo
# アカウントを作成する
# ユーザーアカウントが存在しているかを確認

cra_user = native_user().cra_user()


@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if not data:
        return jsonify({"error": "データが見つかりません"}), 400

    try:
        if check_email := cra_user.check_email(data):
            return check_email

        if check_name := cra_user.check_name(data):
            return check_name

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    user_profile = cra_user.profile(data)

    try:
        cra_user.save_db(user_profile)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "アカウントが作成されました"}), 201


short_collection = db.short
normal_collection = db.normal
long_collection = db.long


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


if __name__ == "__main__":
    # serve(app, host="0.0.0.0", port=port)  # 本番環境ではFalse(セキュリティ上の問題)
    app.run(debug=True, host="0.0.0.0", port=port)
