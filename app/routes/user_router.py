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
from ..config import config, limiter
from ..model.auth import jwt_manager, require_api_key
from ..storege.ranking_manager import fetch_ranking
import traceback


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

    # *** コメント
    # *** 設計 = ターゲットがいる場合そのユーザーの付近のランキング(10~{user}~10)も送信

    try:
        fetch_level: Optional[str] = request.args.get("level" or None)
        fetch_renge_start: Optional[int] = int(request.args.get("range_from")) if request.args.get('range_from') else None
        fetch_renge_end: Optional[int] = int(request.args.get("range_to")) if request.args.get("range_to") else None
        fetch_target_user_name: Optional[str] = request.args.get("target" or None)

        if fetch_level is None:
            print("anal")
            make_response({"message": "パラメーターねえ"}, 410)

        # レスポンスパターン
        # 1. 範囲 + ターゲットとその周辺
        # 2. 範囲のみ
        # 3. ターゲットとその周辺のみ
        # 4. 値エラー

        # i fucking hate this shit every fucking time

        print([fetch_level, fetch_renge_start, fetch_renge_end, fetch_target_user_name])

        if (
            fetch_target_user_name == None
            and fetch_renge_start
            and fetch_renge_end
            and fetch_level
        ):
            try:
                return make_response(
                    {
                        "message": "性行",
                        "range": fetch_ranking.fetch_ranking_by_renge(
                            start=fetch_renge_start, end=fetch_renge_end
                        ),
                    },
                    200,
                )

            except Exception as e:
                return make_response({"messge": "error"}, 500)

        elif (
            fetch_renge_start == None
            and fetch_renge_end == None
            and fetch_target_user_name
            and fetch_level
        ):
            try:
                return make_response(
                    {
                        "message": "性行",
                        "target": fetch_ranking.fetch_user_around(
                            level=fetch_level, target_user_name=fetch_target_user_name
                        ),
                    },
                    200,
                )
            except Exception as e:
                return make_response({"messge": "error"}, 500)

        renge_res = fetch_ranking.fetch_ranking_by_renge(
            level=fetch_level, start=fetch_renge_start, end=fetch_renge_end
        )
        target_res = fetch_ranking.fetch_user_around(
            level=fetch_level, target_user_name=fetch_target_user_name
        )
        
        return make_response(
            {"message": "取得に成功", "range": renge_res, "target": target_res}, 200
        )

    except Exception as e:
        print(e)
        traceback.print_exc()
        return make_response({"message": "お前はちんこだ"}, 500)
