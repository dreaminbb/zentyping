import os
import hashlib
import hmac
from flask import (
    Blueprint,
    Response,
    request,
    redirect,
    jsonify,
    make_response,
)
from flask_limiter.util import get_remote_address
from ..config import config
from ..model.play import play
from ..main import limiter
from ..model.auth import github, csrf_maneger

play_bp = Blueprint("play_bp", __name__)
github_bp = Blueprint("github", __name__)


@play_bp.route("/get_pbm", methods=["GET"])
@limiter.limit("10 per minute", key_func=get_remote_address)
def get_problem():
    respnse = play().get_problem()
    return respnse


@play_bp.route("/result", methods=["POST"])
def save_result():
    try_save = play().save_result(
        access_token=request.cookies.get("access_token"), play_info=request.json
    )
    if try_save == None:
        return jsonify({"message": "ユーザーが存在しません"}, 404)
    if try_save == False:
        return jsonify({"message": "保存に失敗しました。"}, 500)

    return jsonify({"message": "プレイ履歴を更新しました。"}, 200)


@github_bp.route("/")
def github_signin():
    # CSRFトークンをつける
    csrf_toen = csrf_maneger().generate()
    print(csrf_toen, "csfrトークン")
    response = make_response(redirect(config.GITHUB_REDIRECT_URL))
    response.set_cookie("token", csrf_toen)
    print("cookieにつけた")
    return response


@github_bp.route("/callback")
def github_callback():
    code = request.args.get("code")
    csrf_token: str = request.cookies.get("token")
    velidate: bool = csrf_maneger().velidate(token=csrf_token)
    if velidate == True and code:
        print("トークンもあってるしコードもちゃんとある")
        response: Response = github().sign_in_login(code)
        response.delete_cookie("token")
        return response
    if velidate == False:
        print("トークンがおかしい")
        return make_response({"message": "エラーが発生しました"})
