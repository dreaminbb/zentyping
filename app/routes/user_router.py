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
from ..model.auth import session_manager, native, github, cookie_manager
from ..model.user import user
from ..model.log import recorder
from ..main import limiter
from app import config, db


user_bp = Blueprint("user_bp", __name__)
verify_bp = Blueprint("verify_bp", __name__)
github_bp = Blueprint("github", __name__)


@user_bp.route("/session", methods=["POST"])
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


@user_bp.route("/exit", methods=["POST"])
@limiter.limit("10 per minute", key_func=get_remote_address)
def user_exit():
    session_id = request.cookies.get("session_id")
    recorder().access_time_session_user_db(session_id=session_id)
    return jsonify({"message": "🫡"})


@user_bp.route("/logout", methods=["POST"])
def logout():
    session_id: str = request.cookies.get("session_id")
    refresh_token: str = request.cookies.get("refresh_token")
    db["session"].delete_one({"session_id": session_id, "refresh_token": refresh_token})
    res = make_response(redirect("/"))
    res.delete_cookie("access_token")
    res.delete_cookie("refresh_token")
    res.delete_cookie("session_id")
    res.delete_cookie("expires")
    return res


@user_bp.route("/native_register", methods=["POST"])
def native_register():
    if request.content_type != "application/json":
        return jsonify({"message": "Unsupported Media Type"}), 415

    email: str = request.json["email"]
    name: str = request.json["name"]
    if email and name:
        try:

            same_email_result = user().find_by_email(email)
            same_name_result = user().find_by_name(name)
            if same_email_result:
                return jsonify({"message": config.USER_EMAIL_EXISTS_MESSAGE}), 409
            if same_name_result:
                return jsonify({"message": config.USER_NAME_EXISTS_MESSAGE}), 409

            user_id: str = str(uuid.uuid4())
            password: str = request.json["password"]
            user_type: str = "native"
            create = user().create_save(user_id, email, password, name, user_type)
            if not create:
                return jsonify({"message": config.ERROE_MESSAGE}), 500
            user_agent = request.headers.get("User-Agent")
            ip_address = request.remote_addr
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


@user_bp.route("/native_login", methods=["POST"])
def native_login():
    # if request.A != "application/json":
    #     return jsonify({"message": "Unsupported Media Type"}), 415

    email: str = request.json["email"]
    password: str = request.json["password"]
    if email and password:
        verify_password = native().verify_password(email, password)
        if verify_password == True:
            user_info = user.find_and_get_user_info(email, "native")
            user_id = user_info["id"]
            ip_address = request.remote_addr
            user_agent = request.headers.get("User-Agent")

            response = cookie_manager().set_cookie_response(
                user_id=user_id,
                ip_address=ip_address,
                user_agent=user_agent,
                redirect_url="/",
            )
            return response, 200
        if verify_password == False:
            return "444", 444  # パスワードかユーザー名が違う
        if verify_password == None:
            return "446", 446  # DBにユーザーがいない

    if not email or password:
        return jsonify({"message": "wahts a data 👀"}), 400


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
