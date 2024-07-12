from flask import Blueprint, request, Response
from ..model.auth import jwt_manager

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/access", methods=["POST"])
def verify_session():
    res: Response = jwt_manager().verify_access_token(
        jwt_token=request.headers.get("Authorization") or None
    )
    return res


@user_bp.route("/refresh", methods=["POST"])
def refresh():
    res: Response = jwt_manager().verify_updata_refresh(
        jwt_token=request.headers.get("Authorization") or None
    )
    return res


# @app.route("/refresh", methods=["POST"])
# def refresh():
#     try:
#         refresh_token = request.get_json()
#         print(refresh_token)
#         if not refresh_token:
#             return jsonify({"message": "リフレッシュトークンが見つかりません"}), 400

#         payload = jwt.decode(
#             refresh_token,
#             key=os.getenv("JWT_SECRET"),
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

#         jwt_manager().del_old_be_invalid(user_id)
#         new_access_token = jwt_manager().generate(user_id, user_type)[0]
#         new_refresh_token = jwt_manager().generate(user_id, user_type)[1]
#         return jsonify(
#             {"access_token": new_access_token, "refresh_token": new_refresh_token}
#         )

#     except Exception as e:
#         print(e)
#         return jsonify({"message": "認証失敗...."}), 401


# # ユーザー作成
# @app.route("/register", methods=["POST"])
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


# @app.route("/login", methods=["POST"])
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
#             jwt_manager().del_old_be_invalid(
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


# # ユーザーを認証ページへとリダイレクト
# @app.route("/github_sign_redirect")
# def github_sign_redirect():
#     return redirect(github_oauth.get_url())


# @app.route("/callback")
# def github_callback():
#     code = request.args.get("code")
#     if not code:
#         return jsonify({"error": "codeが見つかりません"}), 400
#     try:
#         access_token = github_oauth.get_access_token(code)
#         user_info = github_oauth.get_user_info(access_token)
#         user_email = github_oauth.get_user_email(access_token)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     return redirect("http://localhost:5173/userprofile")
