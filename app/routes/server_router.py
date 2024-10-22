from typing import Optional
import uuid
from flask import (
    Blueprint,
    Response,
    request,
    redirect,
    jsonify,
    make_response,
)
from flask_limiter.util import get_remote_address
from flask_limiter.util import get_remote_address
from ..model.auth import (
    session_manager,
    native,
    github,
    cookie_manager,
)
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..."))
from ..model.log import recorder
from app.config import app, limiter, config
from ..model.user import user
from ..model.auth import github, csrf_maneger, session_manager
from app.config import db

github_bp = Blueprint("github", __name__)
auth_bp = Blueprint("auth", __name__)


@app.route("/session", methods=["POST"])
@limiter.limit("10 per minute", key_func=get_remote_address)
def session():
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    if not access_token or not refresh_token:
        return jsonify({"message": config.TOKEN_NOT_FOUND_MESSAGE}), 401
    response = session_manager().verify(
        access_token=access_token, refresh_token=refresh_token
    )
    return response


@app.route("/exit", methods=["POST"])
@limiter.limit("10 per minute", key_func=get_remote_address)
def user_exit():
    session_id: Optional[str] = request.cookies.get("session_id")
    recorder().access_time_session_user_db(session_id=session_id)
    return jsonify({"message": "🫡"})


@app.route("/logout", methods=["POST"])
def logout():
    session_id: Optional[str] = request.cookies.get("session_id")
    refresh_token: Optional[str] = request.cookies.get("refresh_token")
    db["session"].delete_one({"session_id": session_id, "refresh_token": refresh_token})
    res = make_response(redirect("/"))
    res.delete_cookie("access_token")
    res.delete_cookie("refresh_token")
    res.delete_cookie("session_id")
    res.delete_cookie("expires")
    return res


@app.route("/native_register", methods=["POST"])
def native_register():
    if request.content_type != "application/json":
        return jsonify({"message": "Unsupported Media Type"}), 415
    if request.json is None:
        return make_response({"message": "??????"}, 400)

    email: Optional[str] = request.json["email"]
    name: Optional[str] = request.json["name"]
    password: Optional[str] = request.json["password"]
    user_agent: Optional[str] = request.headers.get("User-Agent")
    ip_address: Optional[str] = request.remote_addr
    if email and name and user_agent and ip_address:
        try:

            same_email_result = user().find_by_email(email)
            same_name_result = user().find_by_name(name)
            if same_email_result:
                return jsonify({"message": config.USER_EMAIL_EXISTS_MESSAGE}), 409
            if same_name_result:
                return jsonify({"message": config.USER_NAME_EXISTS_MESSAGE}), 409

            user_id: str = str(uuid.uuid4())
            create = user().create_save(
                user_id, email, password, name, user_type="native"
            )
            if not create:
                return jsonify({"message": config.ERROE_MESSAGE}), 500
            response = cookie_manager().set_cookie_response(
                user_agent=user_agent,
                ip_address=ip_address,
                user_id=user_id,
                redirect_url="/",
            )
            return response, 200

        except Exception as e:
            print(e)
            return jsonify({"message": config.ERROE_MESSAGE}), 500
    else:
        return jsonify({"message": "wahts a data 👀"}), 400


@app.route("/native_login", methods=["POST"])
def native_login():
    if request.content_type != "application/json":
        return jsonify({"message": "Unsupported Media Type"}), 415

    if request.json is None:
        return make_response({"message": "なめとんのかぼけ"})

    email: Optional[str] = request.json["email"]
    password: Optional[str] = request.json["password"]
    ip_address: Optional[str] = request.remote_addr
    user_agent: Optional[str] = request.headers.get("User-Agent")
    if email and password and user_agent and ip_address:

        verify_password = native().verify_password(email, password)
        if verify_password == True:
            user_info = user.find_and_get_user_info(email, "native")
            user_id: Optional[str] = user_info["id"] if user_info else None
            if user_id is not None:
                response = cookie_manager().set_cookie_response(
                    user_id=user_id,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    redirect_url="/",
                )
                return response, 200

        if verify_password is False:
            return "444", 444  # パスワードかユーザー名が違う

        if verify_password is None:
            return "446", 446  # DBにユーザーがいない

    if not email or password:
        return jsonify({"message": "whats a data 👀"}), 400

    return make_response({"success": False, "message": "エラーが発生しました。"})


@auth_bp.route("/github")
def github_signin():
    csrf_token = csrf_maneger().generate()
    response = make_response(redirect(config.GITHUB_REDIRECT_URL))
    response.set_cookie("token", csrf_token)
    return response


@auth_bp.route("/callback")
def github_callback():
    code: Optional[str] = request.args.get("code")
    csrf_token: Optional[str] = request.cookies.get("token")
    if csrf_token:
        scrf_validity: bool = csrf_maneger().velidate(token=csrf_token)
        if scrf_validity and code:
            response: Response = github().sign_in_login(code)
            # response.delete_cookie("token")
            return response
        if not scrf_validity:
            return make_response({"無効なリクエスト"}), 400
    return make_response({"message": "無効なリクエスト"}), 400
