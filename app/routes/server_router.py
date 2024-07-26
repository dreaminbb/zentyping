from flask import Blueprint, Response, request, redirect, jsonify
from flask_limiter.util import get_remote_address
from ..model.play import play
from ..main import limiter

play_bp = Blueprint("play_bp", __name__)


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
