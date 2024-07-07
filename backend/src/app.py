import os
from dotenv import load_dotenv
from flask import Response, redirect, make_response, request
from pymongo import MongoClient
from flask import Flask, jsonify
import datetime
import uuid
import json
import hashlib
import requests
from flask_cors import CORS
from bson import json_util
from typing import Tuple
import jwt


# 本番環境で変更すること
# cookieの設定(Secure HTTPOnly)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # セキュリティ意識高めでいこう
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


class jwt_maneger:

    def generate(self, user_id: str, user_type: str) -> dict:

        jti = str(uuid.uuid4())
        url = os.getenv("URL")
        access_token: str = jwt.encode(
            {
                # "iss": url,
                "user_id": user_id,
                "type": user_type,
                "exp": datetime.datetime.now(datetime.timezone.utc)
                + datetime.timedelta(minutes=int(os.getenv("JWT_EXPIRES_IN"))),
                "role": "user",
            },
            os.getenv("JWT_SECRET"),
            algorithm=os.getenv("JWT_ALGORITHM"),
        )

        refresh_token: str = {
            "iss": url,
            "sub": user_id,
            # "aud": os.getenv("URL"),
            "exp": datetime.datetime.now(datetime.timezone.utc)
            + datetime.timedelta(days=int(os.getenv("JWT_EXPIRES_IN_REFRESH"))),
            "jti": jti,
        }
        db["refresh_token"].insert_one(json.loads(json_util.dumps(refresh_token)))

        encoded_refresh_token = jwt.encode(
            refresh_token, os.getenv("JWT_SECRET"), algorithm=os.getenv("JWT_ALGORITHM")
        )

        return access_token, encoded_refresh_token

    def add_cookie(self, access_token, encoded_refresh_token):
        user_cookie = {
            "access_token": access_token,
            "refresh_token": encoded_refresh_token,
            "path": "/",
            "httponly": True,
            # "Secure": True,
            # "sameSite": "None",
        }
        return user_cookie


class native:
    # ここがユーザー情報のエントリーポイント
    def search_email(self, email: str) -> bool:
        try:
            same_email = db["user"].find_one({"email": email})

            if same_email:
                return True
            else:
                return False

        except Exception as e:
            print(e)

    def search_name(self, name: str) -> bool:
        try:
            same_name = db["user"].find_one({"name": name})
            if same_name:
                print(same_name)
                return True
            else:
                return False
        except Exception as e:
            print(e)
            return jsonify({"error": str(e)}), 500

    def create_save(email, password, name, user_type, user_id) -> bool:

        try:
            if not email or not name or not user_type:
                return jsonify({"error": "データが見つかりません"}), 400

            salt = os.urandom(32)
            # ここでパスワードをハッシュ化して適切なJSONに変換している
            hashed_password = (
                hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8")
                + salt
            )

            # ユーザーIDの生成
            user_profile = {
                "id": user_id,
                "type": "native",
                "email": email,
                "password": hashed_password,
                "name": name,
                "play_info": {"total_play": 0, "total_time": 0},
                "play_history": {},
            }

            db["user"].insert_one(user_profile)
            return True
        except Exception:
            return False

    def login(self, email: str, password: str):
        try:
            user = db["user"].find_one({"email": email})
            if not user:
                return jsonify({"message": "ユーザーが見つかりません"}), 404

            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            decoded_password = user["password"][:64].decode("utf-8")

            if decoded_password == hashed_password:
                print("correct password")
                return True
            else:
                print("incorrect password")
                return False

        except Exception as e:
            print(e)
            return jsonify({"error": ("error")}), 500


# セッションが有効かどうかの確認
@app.route("/access", methods=["POST"])
def session_check():
    jwt_token = request.headers.get("token").replace('"', "")
    print(jwt_token)

    if not jwt_token:
        return jsonify({"message": "トークンが見つかりません"}), 400

    try:
        payload = jwt.decode(
            jwt_token,
            key=os.getenv("JWT_SECRET"),
            algorithms=[os.getenv("JWT_ALGORITHM")],
        )

        return jsonify({"message": "トークンが有効です", "login": True}), 200
    except jwt.ExpiredSignatureError:
        print("timeout")
        return jsonify({"timeout": True}), 200

    except jwt.InvalidTokenError as e:
        db["invalid_tokens"].insert_one(
            {
                "token": jwt_token,
                "detected_at": datetime.datetime.now(datetime.timezone.utc),
            }
        )
        print(e)
        print("invalid token")
        return jsonify({"message": "トークンが無効です"}), 401

    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/refresh", methods=["POST"])
def refresh():
    try:
        refresh_token = request.headers.get("token").replace('"', "")
        print(request.headers.get("token"))
        if not refresh_token:
            return jsonify({"message": "リフレッシュトークンが見つかりません"}), 400

        payload = jwt.decode(
            refresh_token,
            key=os.getenv("JWT_SECRET"),
            algorithms=[os.getenv("JWT_ALGORITHM")],
        )

        # ユーザーのIDをペイロードから取得してDBのユーザー情報のIDを参照
        jti = payload["jti"]
        if db["refresh_token"].find_one({"jti": jti}):
            user_id = payload["sub"]
            user_type = db["user"].find_one({"id": user_id})["type"]

        new_access_token = jwt_maneger().generate(user_id, user_type)[0]
        new_refresh_token = jwt_maneger().generate(user_id, user_type)[1]
        return jsonify(
            {"access_token": new_access_token, "refresh_token": new_refresh_token}
        )

    except Exception as e:
        print(e)
        return jsonify({"message": "認証失敗...."}), 401


# ユーザー作成
@app.route("/register", methods=["POST"])
def native_register():
    if not request.json:
        return jsonify({"error": "データが見つかりません"}), 400

    data = request.json
    email = data["email"]
    name = data["name"]
    password = data["password"]
    user_type = data["type"]
    if not email or not name or not user_type:
        return jsonify({"error": "データが見つかりません"}), 400

    # if there are same email or name in db , return message
    if native().search_email(email):
        return jsonify({"message": "あ〜それメアド使われてるかも〜。。。"}), 400
    if native().search_name(name):
        return jsonify({"message": "悪いけどその名前使われてるっす"}), 400

    # プロフィールを作成してDBに保存

    user_id = str(uuid.uuid4())
    salt = os.urandom(32)
    # ここでパスワードをハッシュ化して適切なJSONに変換している
    hashed_password = (
        hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8") + salt
    )
    # ユーザーIDの生成
    user_profile = {
        "id": user_id,
        "type": user_type,
        "email": email,
        "password": hashed_password,
        "name": name,
        "play_info": {"total_play": 0, "total_time": 0},
        "play_history": {},
    }
    db["user"].insert_one(user_profile)
    token = jwt_maneger().generate(user_id, user_type)
    cookie = jwt_maneger().add_cookie(
        access_token=token[0], encoded_refresh_token=token[1]
    )  # 0=access_token,1=refresh_token

    return make_response(jsonify({"status": "passed", "cookie": cookie}), 200)


@app.route("/login", methods=["POST"])
# @app.errorhandler(404)
def native_login():
    if (
        not request.json
        or "email" not in request.json
        or "password" not in request.json
    ):
        return jsonify({"error": "メールアドレスまたはパスワードが見つかりません"}), 400

    email = request.json["email"]
    password = request.json["password"]
    user_type = request.json["type"]
    result = native().login(email, password)


    if result == True:
        user_id = db["user"].find_one({"email": email})["id"]
        if user_id:
            token = jwt_maneger().generate(user_id, user_type)
            cookie = jwt_maneger().add_cookie(
                access_token=token[0], encoded_refresh_token=token[1]
            )

            return jsonify(
                {"login": True, "cookie": cookie}
            )  # 0=access_token,1=refresh_token
    else:
        return jsonify({"massage": "パスワード又はメールアドレスが違います"}), 401


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


# 問題取得
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
