from typing import Optional
import uuid
from flask import (
    Blueprint,
    make_response,
    request,
    Response,
    jsonify,
    redirect,
)
from flask_limiter.util import get_remote_address
from app.config import limiter
from ..model.log import recorder
from ..model.user import user, play

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/get_pbm", methods=["GET"])
@limiter.limit("10 per minute", key_func=get_remote_address)
def get_problem():
    response = play().get_problem()
    print(response)
    return response

@user_bp.route("/result", methods=["POST"])
def save_result():
    access_token: Optional[str] = request.cookies.get("access_token")
    if request.json is not None and access_token:
        try_save = play().save_result(access_token=access_token, play_info=request.json)
        if try_save is None:
            return make_response({"message": "ユーザーが存在しません"}, 404)
        if not try_save:
            return make_response({"message": "保存に失敗しました。"}, 500)

        return make_response({"message": "プレイ履歴を更新しました。"}, 200)

    else:
        return make_response({"success": False, "message": "エラーが発生しました。"}, 500)


@user_bp.route("/info", methods=["GET"])
def get_user_info() -> Response:
    access_token: Optional[str] = request.cookies.get("access_token")
    if access_token:
        tmp: Optional[dict] = user().get_user_info(access_token=access_token)
        if tmp is None:
            return make_response({"message": "ユーザーが存在しません"}, 404)
        return make_response(tmp, tmp["status"])

    elif not access_token:
        return make_response({"success": False, "message": "no token?"}, 401)

    return make_response({"success": True, "user_info": user_info})

    return make_response({"success": False, "message": "問題が発生しました"}, 500)
