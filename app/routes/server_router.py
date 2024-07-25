from flask import (
    Blueprint,
    Response,
    request,
    redirect,
)
from flask_limiter.util import get_remote_address
from ..model.play import play
from ..main import limiter

play_bp = Blueprint("play_bp", __name__)


@play_bp.route("/get_pbm", methods=["GET"])
@limiter.limit("10 per minute", key_func=get_remote_address)
def get_problem():
    respnse = play().get_problem()
    return respnse


# @play_bp.route("/result", methods=["POST"])
# def save_result():
#     try_save = play().save_result(access_token=request.cookies.get("access_token"))


