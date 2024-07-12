import os
from flask import jsonify, make_response, Response
import datetime
import uuid
import hashlib
import jwt
from pymongo import MongoClient
from app import config

db = MongoClient(config.MONGO_URL)[config.MONGO_DB_NAME]


class jwt_manager:

    def __init__(self) -> None:

        if config.JWT_SECRET and config.JWT_ALGORITHM:
            self.url = config.URL
            self.key = config.JWT_SECRET
            self.algorithm = config.JWT_ALGORITHM
            self.expires_in = config.JWT_EXPIRES_IN
            self.expires_in_refresh = config.JWT_EXPIRES_IN_REFRESH
            self.jti = str(uuid.uuid4())
        pass

    def generate(self, user_id: str, user_type: str) -> tuple[str, str]:

        access_token: str = jwt.encode(
            {
                # "iss": url,
                "user_id": user_id,
                "iat": datetime.datetime.now(datetime.timezone.utc),
                "exp": datetime.datetime.now(datetime.timezone.utc)
                       + datetime.timedelta(minutes=int(config.JWT_EXPIRES_IN)),
                "role": "user",
                "type": user_type,
            },
            key=self.key,
            algorithm=self.algorithm,
        )

        refresh_token: dict = {
            "iss": self.url,
            "sub": user_id,
            # "aud": os.getenv("URL"),
            "exp": datetime.datetime.now(datetime.timezone.utc)
                   + datetime.timedelta(days=self.expires_in_refresh),
            "jti": self.jti,
        }

        encoded_refresh_token: str = jwt.encode(
            refresh_token, key=self.key, algorithm=self.algorithm
        )

        db["refresh_token"].find_one_and_delete({"sub": user_id})
        db["refresh_token"].insert_one(refresh_token)

        return access_token, encoded_refresh_token

    def verify_access_token(self, jwt_token: str | None) -> Response:

        if not jwt_token:
            print("no token")
            return jsonify(
                {
                    "success": False,
                    "token": False,
                    "message": "エラーが発生しましたログインし直してください",
                }
            )

        try:
            payload = jwt.decode(
                jwt_token,
                key=self.key,
                algorithms=[self.algorithm]
            )
            print("good token")

            return jsonify({"success": True, "massage": "おかえり！！"})
        except jwt.ExpiredSignatureError:  # 期限切れ
            db["invalid_tokens"].insert_one(
                {
                    "token": jwt_token,
                    "detected_at": datetime.datetime.now(datetime.timezone.utc),
                }
            )
            print("timeout")
            return jsonify({"success": False, "timeout": True, "message": "再ログインしてください..."})

        except jwt.InvalidTokenError:
            db["invalid_tokens"].insert_one(
                {
                    "token": jwt_token,
                    "detected_at": datetime.datetime.now(datetime.timezone.utc),
                }
            )
            print("invalid token")
            return jsonify({"success": False, "message": ".........."})

        except Exception as e:
            print(e)
            return jsonify({"message": "エラーが発生しました"})

    def token_be_invalid(self, user_id: str) -> None:
        old_token = db["refresh_token"].find_one({"sub": user_id})
        if old_token:
            db["invalid_tokens"].insert_one(old_token)
            db["refresh_token"].delete_one({"sub": user_id})
            return
        else:
            return

    def add_cookie(self, user_id: str, user_type) -> dict:
        access_token = self.generate(user_id, user_type)[0]
        encoded_refresh_token = self.generate(user_id, user_type)[1]
        user_cookie = {
            "access_token": access_token,
            "refresh_token": encoded_refresh_token,
            "type": user_type,
            "path": "/",
            # "httponly": True,
            # "Secure": True,
            # "sameSite": "None",
        }
        return user_cookie

    def verify_update_refresh(self, jwt_token: str | None) -> Response:
        try:
            try:
                if jwt_token is None:
                    return make_response(
                        {"message": "ログインし直してください....ごめんぴょ"}, 404
                    )
                print(jwt_token)
                payload = jwt.decode(jwt_token, key=self.key, algorithms=[self.algorithm])
                print(payload)
                sub = payload["sub"]
                result = db["refresh_token"].find_one({"sub": sub})
                user_record = db["user"].find_one({"id": sub})
                if result and user_record:
                    user_id = user_record["id"]
                    user_type = user_record["type"]
                    self.token_be_invalid(user_id)
                    new_access_token = self.generate(user_id, user_type)[0]
                    new_refresh_token = self.generate(user_id, user_type)[1]
                    return make_response(
                        {
                            "access_token": new_access_token,
                            "refresh_token": new_refresh_token,
                        },
                        200,
                    )
                else:
                    print("there are no token owner")
                    return make_response({"message": config.TOKEN_OWNER_NOT_FOUND_MASSEGE}, 404)
            except jwt.ExpiredSignatureError:
                print("timeout~~~ amm have a good day men")
                db["invalid_tokens"].insert_one(
                    {
                        "token": jwt_token,
                        "detected_at": datetime.datetime.now(datetime.timezone.utc),
                    }
                )
                return make_response({"message": config.TOKEN_TIMEOUT_MASSEGE}, 401)
        except jwt.InvalidTokenError as e:
            print("invalid token maybe bey bey")
            db["invalid_tokens"].insert_one(
                {
                    "token": jwt_token,
                    "detected_at": datetime.datetime.now(datetime.timezone.utc),
                }
            )
            print(e)
        return make_response({"message": config.INVALID_TOKEN_MASSEGE}, 401)


# return make_response({"message": "なぜこれを返しているのでしょうか？"}, 500)
# リフレッシュトークンを検証して有効だったら新しいアクセストークンを
# return jsonify(
#     {"access_token": new_access_token, "refresh_token": new_refresh_token}
# )

def refresh(self, refresh_token: str) -> dict | None:
    payload = jwt.decode(refresh_token, key=self.key, algorithms=[self.algorithm])
    sub = payload["sub"]

    user_data = db["user"].find_one({"id": sub})
    if user_data is not None:
        user_id = user_data["id"]
        user_type = user_data["type"]
    else:
        return None

    self.token_be_invalid(user_id)

    new_access_token = jwt_manager().generate(user_id, user_type)[0]
    new_refresh_token = jwt_manager().generate(user_id, user_type)[1]

    return {"access_token": new_access_token, "refresh_token": new_refresh_token}


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
            return False

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
            return False

    def create_save(self, email, password, name, user_type, user_id) -> bool:

        try:

            salt = os.urandom(32)
            # ここでパスワードをハッシュ化して適切なJSONに変換している
            hashed_password = (
                    hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8")
                    + salt
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
            return True
        except Exception as e:
            print(e)
            return False

    def login(self, email: str, password: str) -> tuple[Response, int]:
        try:
            print(email, password)
            user = db["user"].find_one({"email": email})
            if not user:
                return jsonify({"message": "ユーザーが見つかりません"}), 404

            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            decoded_password = user["password"][:64].decode("utf-8")

            if decoded_password == hashed_password:
                print("correct password")
                new_cookie = jwt_manager().add_cookie(user_id=user["id"], user_type=user["type"])
                return jsonify({"new_cookie": new_cookie}), 200

            else:
                print("incorrect password", 401)
                return jsonify({"message": "パスワードまたはメールアドレスが違います"}), 401

        except Exception as e:
            print(e)
            return jsonify({"error": ("error")}), 500

# def i_just_chenged_():
#     try:
#         refresh_token = request.get_json()
#         print(refresh_token)
#         if not refresh_token:
#             return jsonify({"message": "リフレッシュトークンが見つかりません"}), 400

#         payload = jwt.decode(
#             refresh_token,
#             algorithms=[os.getenv("JWT_ALGORITHM")],
#         )

#         # ユーザーのIDをペイロードから取得してDBのユーザー情報のIDを参照
#         sub = payload["sub"]
#         print(sub)
#         if db["refresh_token"].find_one({"sub": sub}):
#             user_id = db["user"].find_one({"id": sub})["id"]
#             user_type = db["user"].find_one({"id": sub})["type"]
#         else:
#             print("no")

#         jwt_manager().token_be_invalid(user_id)
#         new_access_token = jwt_manager().generate(user_id, user_type)[0]
#         new_refresh_token = jwt_manager().generate(user_id, user_type)[1]
#         return jsonify(
#             {"access_token": new_access_token, "refresh_token": new_refresh_token}
#         )

#     except Exception as e:
#         print(e)
#         return jsonify({"message": "認証失敗...."}), 401


# def session_check():
#     jwt_token = request.headers.get("token").replace('"', "")
#     if not jwt_token:
#         return jsonify({"message": "トークンが見つかりません"}), 400

#     try:
#         payload = jwt.decode(
#             jwt_token,
#             key=os.getenv("JWT_SECRET"),
#             algorithms=[os.getenv("JWT_ALGORITHM")],
#         )
#         print(payload)

#         return jsonify({"message": "トークンが有効です", "login": True}), 200
#     except jwt.ExpiredSignatureError:
#         print("timeout")
#         return jsonify({"timeout": True}), 200

#     except jwt.InvalidTokenError as e:
#         db["invalid_tokens"].insert_one(
#             {
#                 "token": jwt_token,
#                 "detected_at": datetime.datetime.now(datetime.timezone.utc),
#             }
#         )
#         print(e)
#         print("invalid token")
#         return jsonify({"message": "トークンが無効です"}), 401

#     except Exception as e:
#         return jsonify({"message": str(e)}), 500


# def refresh():
#     try:
#         refresh_token = request.get_json()
#         print(refresh_token)
#         if not refresh_token:
#             return jsonify({"message": "リフレッシュトークンが見つかりません"}), 400

#         payload = jwt.decode(
#             refresh_token,
#             key=config.JWT_SECRET,
#             algorithm=config.JWT_ALGORITHM,
#         )

#         # ユーザーのIDをペイロードから取得してDBのユーザー情報のIDを参照
#         sub = payload["sub"]
#         user_data = db["user"].find_one({"id": sub})
#         if user_data is not None:
#             user_id = user_data["id"]
#             user_type = user_data["type"]
#         else:
#             print("no")

#         jwt_manager().token_be_invalid(user_id)
#         new_access_token = jwt_manager().generate(user_id, user_type)[0]
#         new_refresh_token = jwt_manager().generate(user_id, user_type)[1]
#         return jsonify(
#             {"access_token": new_access_token, "refresh_token": new_refresh_token}
#         )

#     except Exception as e:
#         print(e)
#         return jsonify({"message": "認証失敗...."}), 401


# # ユーザー作成
# def native_register():
#     if not request.json:
#         return jsonify({"error": "データが見つかりません"}), 400

#     data = request.json
#     email = data["email"]
#     name = data["name"]
#     password = data["password"]
#     user_type = data["type"]
#     if not email or not name or not user_type:
#         return jsonify({"error": "データが見つかりません"}), 400

#     # if there are same email or name in db , return message
#     if native().search_email(email):
#         return jsonify({"message": "あ〜それメアド使われてるかも〜。。。"}), 400
#     if native().search_name(name):
#         return jsonify({"message": "悪いけどその名前使われてるっす"}), 400

#     # プロフィールを作成してDBに保存

#     user_id = str(uuid.uuid4())
#     salt = os.urandom(32)
#     # ここでパスワードをハッシュ化して適切なJSONに変換している
#     hashed_password = (
#         hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8") + salt
#     )
#     # ユーザーIDの生成
#     user_profile = {
#         "id": user_id,
#         "type": user_type,
#         "email": email,
#         "password": hashed_password,
#         "name": name,
#         "play_info": {"total_play": 0, "total_time": 0},
#         "play_history": {},
#     }
#     db["user"].insert_one(user_profile)
#     token = jwt_manager().generate(user_id, user_type)
#     cookie = jwt_manager().add_cookie(
#         access_token=token[0], encoded_refresh_token=token[1]
#     )  # 0=access_token,1=refresh_token

#     return make_response(jsonify({"status": "passed", "cookie": cookie}), 200)


# # @app.errorhandler(404)
# def native_login():
#     if (
#         not request.json
#         or "email" not in request.json
#         or "password" not in request.json
#     ):
#         return jsonify({"error": "メールアドレスまたはパスワードが見つかりません"}), 400

#     email = request.json["email"]
#     password = request.json["password"]
#     user_type = request.json["type"]
#     result = native().login(email, password)

#     if result == True:
#         user_id = db["user"].find_one({"email": email})["id"]  # ユーザーのID取得
#         if user_id:
#             jwt_manager().token_be_invalid(
#                 user_id
#             )  # 既存のリフレッシュトークンを無効にする

#             # 新しいアクセストークン、リフレエッシュトークンを生成
#             token = jwt_manager().generate(user_id, user_type)
#             access_token = token[0]
#             encoded_refresh_token = token[1]
#             cookie = jwt_manager().add_cookie(access_token, encoded_refresh_token)

#             return jsonify(
#                 {"login": True, "cookie": cookie}
#             )  # 0=access_token,1=refresh_token
#     else:
#         return jsonify({"massage": "パスワード又はメールアドレスが違います"}), 401
