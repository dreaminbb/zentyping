import os
import jwt
from typing import Union
from jwt import encode, decode
import datetime
import uuid
from flask import Response, redirect, make_response, request
from flask import Flask, jsonify
import requests
import hashlib
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import json_util
import json

# 本番環境で変更すること
# cookieの設定(Secure HTTPOnly)

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")  # セキュリティ意識高めでいこう
# CORS(app)  # 本番環境では使わないように
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

    def __init__(self) -> None:
        self.secret = os.getenv("JWT_SECRET")
        self.time = int(os.getenv("JWT_EXPIRES_IN"))
        self.algorithm = os.getenv("JWT_ALGORITHM")
        self.user_id = str(uuid.uuid4())
        self.user_cookie = None
        self.server_cookie = None

    def generate(self):

        jwt_token: str = jwt.encode(
            {
                "user_id": self.user_id,
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(minutes=self.time),
            },
            self.secret,
            algorithm=self.algorithm,
        )

        self.user_cookie = {
            "id": self.user_id,
            "jwt_token": jwt_token,
            "path": "/",
            # "httponly": True,
            # "secure": True,
        }

        # 問題あり
        self.server_cookie = [
            {
                "id": self.user_id,
                "jwt": jwt_token,
                "path": "/",
                # "httponly": True,
                # "secure": True,
                # "sameSite": "None",
            }
        ]

        return {"server_cookie": self.server_cookie, "user_cookie": self.user_cookie}

    def refresh(sef, email: str, server_cookie: str):
        user = db["user"].find_one({"email": email})
        if user:
            db["user"].update_one({"email": email}, {"$set": {"cookie": None}})

    def decode(self, token):
        print("デコードしています")
        if token:
            print("トークンあり")
            try:

                try:
                    payload = jwt.decode(token, self.secret, algorithms=self.algorithm)
                    print("decoded", payload)
                except Exception as e:
                    print(jsonify({"error": str(e)}))

                return jsonify(
                    {"massage": "アクセス許可", "status": 200, "login": True}
                )
            except jwt.ExpiredSignatureError:
                print("時間切れ")

                res = make_response(
                    jsonify(
                        {
                            "message": "トークンの有効期限が切れています再ログインしてください"
                        }
                    ),
                    401,
                )

                print("ユーザーに返すレス↓")
                print(res)

                return res

            except jwt.InvalidTokenError:
                # return redirect(os.getenv("NEVER_GANNA_GIVE_YOU_UP_URL"))
                return jsonify({"message": "トークンが無効です"}), 401

            except Exception as e:
                return jsonify({"error": str(e)}), 500

        if not token:
            print("トークンが見つかりません")
            return jsonify({"message": "トークンが見つかりません"}), 400


class native:
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
            return (jsonify({"massage": "そのメールアドレスは既に登録されています"}),)
        else:
            return None

    def check_name(self, data: dict):

        try:
            same_name = self.collection.find_one({"name": data["name"]})
        except Exception as e:
            print(e)
            return jsonify({"error": "エラー(::"}, (e)), 500

        if same_name:
            return (
                jsonify({"massage": "そのユーザー名は既に登録されています"}),
                400,
            )
        else:

            return None

    def profile(self, data, server_cookie) -> dict:

        if not data:
            return jsonify({"error": "データが見つかりません"}), 400

        salt = os.urandom(32)
        # ここでパスワードをハッシュ化して適切なJSONに変換している
        data["password"] = (
            hashlib.sha256(data["password"].encode("utf-8")).hexdigest().encode("utf-8")
            + salt
        )

        # ユーザーIDの生成
        user_profile = {
            "type": "native",
            "email": data["email"],
            "password": data["password"],
            "name": data["name"],
            "cookie": server_cookie,
        }

        return user_profile

    # ここでデータベースに保存している
    def save_db(self, user_profile: dict):
        try:
            self.collection.insert_one(user_profile)

        except Exception as e:
            return jsonify({"error": str(e)}), 500

        return jsonify({"massage": "登録完了"}), 200

    def check_email(self, check_email: str) -> bool:
        same_email = self.collection.find_one(check_email)
        if same_email:
            return True
        return False

    def check_name(self, check_name: str) -> bool:
        same_name = self.collection.find_one(check_name)
        if same_name:
            return True
        return False

    def login(self, email: str, password: str):
        try:
            user = self.collection.find_one({"email": email})

            if not user:
                print("no user")
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


@app.route("/cookie", methods=["POST"])
def cookie_check():
    print(request.headers, "cookie from user")
    print(request.headers.get("Cookies"))
    token = request.headers.get("Cookies")
    if not token:
        print("トークンが見つかりません")
        return jsonify({"message": "トークンが見つかりません"}), 400

    response = jwt_maneger().decode(token)
    print(response)
    return response


@app.route("/register", methods=["POST"])
def user_register():

    data = request.json
    if not data:
        return jsonify({"error": "データが見つかりません"}), 400

    try:
        check_email = native().check_email(data)  # data引数を追加
        if check_email:
            return jsonify(check_email), 200

        check_name = native().check_name(data)  # data引数を追加
        if check_name:
            return jsonify(check_name), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    server_cookie = jwt_maneger().generate()["server_cookie"]
    user_cookie = jwt_maneger().generate()["user_cookie"]
    user_profile = native().profile(data, server_cookie)

    try:
        native().save_db(user_profile)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return make_response(jsonify({"status": "passed", "user_cookie": user_cookie}), 200)


@app.route("/login", methods=["POST"])
# @app.errorhandler(404)
def login():

    if (
        not request.json
        or "email" not in request.json
        or "password" not in request.json
    ):
        return jsonify({"error": "メールアドレスまたはパスワードが見つかりません"}), 400

    email = request.json["email"]
    password = request.json["password"]
    result = native().login(email, password)

    if result == True:
        server_cookie = jwt_maneger().generate()["server_cookie"]
        user_cookie = jwt_maneger().generate()["user_cookie"]
        jwt_maneger().refresh(email, server_cookie)
        response = make_response(
            jsonify(
                {
                    "massage": "ログイン成功",
                    "cookie": user_cookie,
                    "login": True,
                }
            ),
            200,
        )
    elif result == False:
        response = make_response(
            jsonify({"massage": "パスワード又はメールアドレスが違います"}), 401
        )
    else:
        response = make_response(jsonify({"massage": "ログイン失敗"}), 401)

    return response


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
