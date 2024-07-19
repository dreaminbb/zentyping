import uuid
from flask import Blueprint, make_response, request, Response, jsonify, redirect
from app import config
import json
from ..model.auth import jwt_manager, native, github, cookie_maneger
from ..model.user import user


user_bp = Blueprint("user_bp", __name__)
verify_bp = Blueprint("verify_bp", __name__)
github_bp = Blueprint("github", __name__)


# 新しいトークンを生成したらその都度DBのユーザーのaccess_atをトークン生成の中の関数で更新している


# token essencer[0] = access_token, token essencer[1] = refresh_token
@user_bp.route("/session", methods=["POST"])
def verify_session():

    cookie = request.headers.get("Authorization")
    if cookie:
        token_essencer = cookie_maneger().token_essencer(cookie=cookie)
        access_token_result: dict = jwt_manager().verify_token(
            jwt_token=token_essencer[0]
        )
        print(access_token_result)

        if access_token_result.get("success") == True:
            return jsonify({"success": True}), 200

        elif access_token_result.get("timeout") == True:

            refresh_token: str = token_essencer[1]
            refresh_token_result: dict = jwt_manager().verify_token(
                jwt_token=refresh_token
            )

            if (
                refresh_token_result.get("success") == True
            ):  # 返り値にユーザーIDとユーザータイプがある
                user_id: str = refresh_token_result["id"]
                user_type: str = refresh_token_result["type"]
                ip_address = request.remote_addr
                user_agent = request.headers.get("User-Agent")
                new_cookie = str(
                    cookie_maneger().make_cookie(
                        user_id, user_type, ip_address, user_agent
                    )
                )
                response = make_response(jsonify({"success": True}))
                response.set_cookie(new_cookie)
                return response

            elif refresh_token_result.get("timeout") == True:
                return (
                    jsonify(
                        {"message": config.TOKEN_TIMEOUT_MESSAGE, "success": False}
                    ),
                    401,
                )

            elif refresh_token_result.get("invalid") == True:
                return (
                    jsonify(
                        {"message": config.TOKEN_INVALID_MESSAGE, "success": False}
                    ),
                    401,
                )

        elif access_token_result.get("invalid") == True:
            return (
                jsonify({"message": config.TOKEN_INVALID_MESSAGE, "success": False}),
                401,
            )

        elif access_token_result.get("error") == True:
            return (
                jsonify({"message": config.ERROE_MESSAGE, "success": False}),
                500,
            )

    else:
        return (
            jsonify({"message": config.TOKEN_NOT_FOUND_MESSAGE, "success": False}),
            401,
        )


@user_bp.route("/native_login", methods=["POST"])
def native_login():
    # print(request.json["email"], request.json["password"])
    # res: tuple[Response, int] = native().login(
    #     email=request.json["email"],
    #     password=request.json["password"],
    # )

    # return res
    return "fix later"


# cookieを取得->cookieをdictに変換->変換したものがDBにあるかを確認->あれば消して、なかったらエラーを返す
@user_bp.route("/logout", methods=["POST"])
def logout():
    cookie = request.headers.get("Authorization")
    if not cookie:
        return jsonify({"message": "cookie not found"}), 401
    formated_cookie = cookie_maneger().formater(cookie)
    del_cookie_result = cookie_maneger().del_cookie(formated_cookie)

    if del_cookie_result == False:  # cookieがDBに存在しない場合
        return jsonify({"message": "no cookie?", "success": False}), 404
    if del_cookie_result == True:
        return jsonify({"message": "success", "success": True}), 200


@user_bp.route("/native_register", methods=["POST"])
def native_register():
    if not request.json:
        return jsonify({"message": "whats a data 👀"})

    user_id: str = str(uuid.uuid4())
    user_type: str = "native"
    create = user().create_save(
        user_id,
        email=request.json["email"],
        password=request.json["password"],
        name=request.json["name"],
        user_type=user_type,
    )
    if not create:
        return jsonify({"message": "問題発生？"}), 500
    ip_address = request.remote_addr
    user_agent = request.headers.get("User-Agent")
    cookie = jwt_manager().make_cookie(user_id, user_type, ip_address, user_agent)
    return jsonify({"cookie": cookie}), 200


@github_bp.route("/")
def github_signin():
    return redirect(config.GITHUB_REDIRECT_URL)


@github_bp.route("/callback")
def github_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"message": "エラーが発生しました"})
    response = github().sign_in_login(code)
    return response


# @user_bp.route("/exit" , methods=["POST"])
# def user_exit():
#     jwt_token:str = request.headers.get("Token").replace('"', '')
#     print(jwt_token)
#     recorder.access_time(jwt_token)
#     return
