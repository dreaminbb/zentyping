from typing import Optional
from flask import (
    Blueprint,
    make_response,
    request,
    Response,
    jsonify,
    redirect,
)
from flask_limiter.util import get_remote_address
from ..model.log import recorder
from ..model.user import user, play
from ..config import ranking_cache, limiter
from ..model.auth import jwt_manager, require_api_key

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/get_pbm", methods=["GET"])
@limiter.limit("10 per minute", key_func=get_remote_address)
def get_problem():
    response = play().get_problem()
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
        return make_response(
            {"success": False, "message": "エラーが発生しました。"}, 500
        )


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


# todo トークン検証
@user_bp.route("/ranking", methods=["GET"])
def return_ranking() -> Response:
    # if request.json is None:
    # return make_response({"message": "リクエストが不正です。"}, 400)
    # api_key = request.headers.get("API_KEY")
    # is_valid = require_api_key(api_key)
    # if not is_valid or api_key is None:
    #     return make_response({"message": "APIキーが不正です。"}, 401)
    try:
        print(
            request.args.get("level"),
            request.args.get("range_from"),
            request.args.get("range_to"),
            request.args.get("target"),
        )
        fetch_level: Optional[str] = request.args.get("level")
        fetch_renge_start: Optional[int] = int(request.args.get("range_from") or 0)
        fetch_renge_end: Optional[int] = int(request.args.get("range_to") or 10)
        fetch_target_user_name: Optional[str] = request.args.get("target" or None)

        tmp = ranking_cache[fetch_level][fetch_renge_start:fetch_renge_end]
        # ?  設計 = ターゲットがいる場合そのユーザーの付近のランキング(10~{user}~10)も送信

        target_aroud = []
        if fetch_target_user_name:
            for i, user in enumerate(tmp):
                if user["name"] == fetch_target_user_name:
                    print(i)
                    if i < 50:
                       target_aroud = tmp[i - 10 : i + 10]
                else:
                    print("not found")
            print(target_aroud)
            res = make_response(
                {
                    "message": "ランキングを取得しました。",
                    "data": tmp,
                    "target_info": target_aroud,
                },
                200,
            )
            return res
        elif fetch_target_user_name is None:
            return make_response(
                {"message": "ランキングを取得しました。", "data": tmp}, 200
            )
    except KeyError as e:
        print(e)
        print("not found")
        return make_response({"message": "ランキングが見つかりません。"}, 404)
    except Exception as e:
        print(e)
        return make_response({"message": f"エラーが発生しました: {str(e)}"}, 500)
