import base64
import json
import hmac
import time
from flask import jsonify, make_response, Response, redirect, request
import requests
import datetime
import uuid
import hashlib
import jwt
from app import config, db
from ..model.user import user


# todo
# 1. cookieを検証して新しく作った場合は古いvalid cookieを無効にする


def require_api_key(f):
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get("Authorization")
        if api_key != config.SEND_PLAY_INFO_API_KEY:
            response = jsonify({"message": "Unauthorized"})
            response.status_code = 401
            return response
        return f(*args, **kwargs)

    return decorated_function


class jwt_manager:

    def __init__(self) -> None:

        if config.JWT_SECRET and config.JWT_ALGORITHM:
            self.url = config.URL
            self.key = config.JWT_SECRET
            self.algorithm = config.JWT_ALGORITHM
            self.expires_in = config.JWT_EXPIRES_IN
            self.expires_in_refresh = config.JWT_EXPIRES_IN_REFRESH
            self.jti = str(uuid.uuid4())
        pass

    def generate(self, user_id: str) -> dict:

        access_token: str = jwt.encode(
            {
                # "iss": url,
                "sub": user_id,
                "iat": datetime.datetime.now(datetime.timezone.utc),
                "exp": (
                    datetime.datetime.now(datetime.timezone.utc)
                    + datetime.timedelta(minutes=config.JWT_EXPIRES_IN)
                ),
                "role": "user",
            },
            key=self.key,
            algorithm=self.algorithm,
        )

        refresh_token: dict = {
            "iss": self.url,
            "sub": user_id,
            # "aud": os.getenv("URL"),
            "exp": (
                datetime.datetime.now(datetime.timezone.utc)
                + datetime.timedelta(days=self.expires_in_refresh)
            ),
            "jti": self.jti,
        }

        encoded_refresh_token: str = jwt.encode(
            refresh_token, key=self.key, algorithm=self.algorithm
        )

        return {"access_token": access_token, "refresh_token": encoded_refresh_token}

    def verify_token(self, jwt_token: str) -> dict:
        if not jwt_token:
            return {"success": False, "no_token": True}

        try:
            payload = jwt.decode(jwt_token, key=self.key, algorithms=[self.algorithm])
            return {"success": True, "user_id": payload["sub"]}

        except jwt.ExpiredSignatureError:
            db["invalid_tokens"].insert_one(
                {
                    "token": jwt_token,
                    "detected_at": datetime.datetime.now(
                        datetime.timezone.utc
                    ).isoformat(),
                }
            )

            return {"timeout": True, "success": False}

        except jwt.InvalidTokenError:
            db["invalid_tokens"].insert_one(
                {
                    "token": jwt_token,
                    "detected_at": datetime.datetime.now(
                        datetime.timezone.utc
                    ).isoformat(),
                }
            )
            return {"invalid": True, "success": False}

        except Exception:
            return {"error": True, "success": False}


class session_manager:

    def verify(self, access_token: str, refresh_token: str) -> Response:
        try:
            at_result = jwt_manager().verify_token(jwt_token=access_token)
            find_session = db["session"].find_one(
                {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "session_id": request.cookies.get("session_id"),
                }
            )
            if not find_session:
                response = make_response(
                    {
                        "success": False,
                        "login": False,
                        "message": config.SESSION_DOSENT_EXIST_MESSAGE,
                    }
                )

                del_cookie: list = [
                    "access_token",
                    "refresh_token",
                    "session_id",
                    "expires",
                ]
                for cookie in del_cookie:
                    response.delete_cookie(cookie)

                return response

            if at_result["success"] == True:
                return (
                    jsonify(
                        {
                            "message": "success",
                            "session": True,
                            "success": True,
                            "login": True,
                        }
                    ),
                    200,
                )

            if at_result["timeout"] == True:
                rt_result = jwt_manager().verify_token(jwt_token=refresh_token)

                if rt_result["success"] == True:
                    new_tokens = jwt_manager().generate(user_id=rt_result["id"])
                    response = make_response({"success": True, "session": True})
                    response.set_cookie("access_token", new_tokens["access_token"])
                    response.set_cookie("refresh_token", new_tokens["refresh_token"])
                    return response, 200

                if rt_result["timeout"] == True:
                    return (
                        jsonify(
                            {"message": config.TOKEN_TIMEOUT_MESSAGE, "session": False}
                        ),
                        401,
                    )

                if rt_result["invalid"] == True:
                    return (
                        jsonify(
                            {"message": config.INVALID_TOKEN_MESSAGE, "session": False}
                        ),
                        401,
                    )

            if at_result["invalid"] == True:
                return (
                    jsonify(
                        {"message": config.INVALID_TOKEN_MESSAGE, "session": False}
                    ),
                    401,
                )

        except Exception as e:
            print(e)
            return jsonify({"error": "error", "session": False}), 500


class cookie_manager:

    # cookie作成→DBに保存→レスポンスにcookieをセットして返す
    def save_and_set(self, user_id: str, ip_address: str, user_agent: str) -> Response:
        tokens: dict = jwt_manager().generate(user_id=user_id)
        encoded_access_token = tokens["access_token"]
        encoded_refresh_token = tokens["refresh_token"]
        session_id = str(uuid.uuid4().hex)

        try:

            server_cookie = {
                "ip_address": ip_address,
                "user_agent": user_agent,
                "user_id": user_id,
                "access_token": encoded_access_token,
                "refresh_token": encoded_refresh_token,
                "session_id": session_id,
                "start_time": datetime.datetime.now().isoformat(),
                "expires": (
                    datetime.datetime.now()
                    + datetime.timedelta(minutes=config.SESSION_EXPIRES_IN)
                ).isoformat(),
                "last_access_time": datetime.datetime.now().isoformat(),
            }

            db["session"].delete_one({"user_id": user_id})
            db["session"].insert_one(server_cookie)

            auth_dict = {
                "access_token": encoded_access_token,
                "refresh_token": encoded_refresh_token,
                "session_id": session_id,
            }

            return auth_dict

        except Exception as e:
            print(e)
            return {"error": "error"}

    def set_cookie_response(
        self, user_id: str, ip_address: str, user_agent: str, redirect_url: str
    ) -> Response:

        if not all([user_id, ip_address, user_agent]):
            return make_response({"error": "error"}), 500

        auth_dict: dict = self.save_and_set(
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        half_hour: int = int(datetime.datetime.now().timestamp()) + 60 * 30
        ten_day: int = int(datetime.datetime.now().timestamp()) + 60 * 60 * 24 * 10

        if redirect_url:
            response = make_response(
                redirect(redirect_url), {"success": True, "login": True}
            )
        if not redirect_url:
            response = make_response(redirect("/"), {"success": True, "login": True})

        response.set_cookie(
            "access_token",
            auth_dict["access_token"],
            expires=half_hour,
            # secure=True,
            # httponly=True,
            # samesite="None",
        )
        response.set_cookie(
            "refresh_token",
            auth_dict["refresh_token"],
            expires=ten_day,
            # secure=True,
            # httponly=True,
            # samesite="None",
        )
        response.set_cookie(
            "session_id",
            auth_dict["session_id"],
            expires=half_hour,
            # secure=True,
            # httponly=True,
            # samesite="None",
        )

        return response


class native:
    @staticmethod
    def verify_password(email: str, password: str) -> bool | dict:
        try:
            print(email, password)
            user = db["user"].find_one({"email": email})

            if not user:
                return {"user": None}

            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            decoded_password = user["password"][:64].decode("utf-8")

            if decoded_password == hashed_password:
                print("correct password")
                return True

            else:
                return False

        except Exception as e:
            print(e)
            return {"error": True}


class csrf_maneger:

    def __init__(self) -> None:
        self.hmac_secret = (config.HMAC_SECRET_KEY).encode()
        pass

    def generate(self) -> str:
        timestamp = str(int(time.time())).encode()
        token = base64.urlsafe_b64encode(
            hmac.new(self.hmac_secret, timestamp, hashlib.sha256).digest()
            + b":"
            + timestamp
        )
        return token.decode()

    def velidate(self, token: str) -> bool:
        try:
            decoded_token = base64.urlsafe_b64decode(token.encode())
            token_hmac, timestamp = decoded_token.split(b":")
            expected_hmac = hmac.new(
                self.hmac_secret, timestamp, hashlib.sha256
            ).digest()
            if hmac.compare_digest(token_hmac, expected_hmac):
                return True
            return False
        except Exception as e:
            print(e)
            return False


class github:

    def __init__(self):
        self.client_id = config.GITHUB_CLIENT_ID
        self.client_secret = config.GITHUB_CLIENT_SECRET
        self.access_token_url = config.GITHUB_ACCESS_TOKEN_RTL
        self.access_token_params = None
        self.authorize_url = config.GITHUB_AUTHORIZATION_RL
        self.authorize_params = None
        self.api_base_url = config.GITHUB_API_BASE_URL
        self.client_kwargs = {"scope": "user:email"}

    # ユーザー情報を取得
    def sign_in_login(self, code):
        try:
            try:
                token_response = requests.post(
                    self.access_token_url,
                    headers={
                        "Accept": "application/json"
                    },  # 括弧を外すとjsonDecodeErrorが発生する
                    data={
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                        "code": code,
                    },
                )
            except (
                requests.exceptions.HTTPError
            ) as http_err:  # サーバーがからのレスポンスを返した時
                return jsonify({"error": f"HTTP error occurred: {http_err}"}), 500
            except (
                requests.exceptions.RequestException
            ) as req_err:  # レスポンスが有効なjsonを返していない時
                return jsonify({"error": f"Request error occurred: {req_err}"}), 500
            except ValueError as json_err:  # 期待したデーターが帰ってこなかった時
                return jsonify({"error": f"JSON decode error: {json_err}"}), 500

            access_token = token_response.json()["access_token"]
            # アクセストークンなし
            if not access_token:
                return jsonify({"message": config.FAILED_TO_AUTH_MESSAGE}), 400

            try:
                # トークンを用いてユーザー情報を取得(emailはなし)
                user_response = requests.get(
                    f"{self.api_base_url}/user",
                    headers={
                        "Accept": "application/vnd.github.v3+json",
                        "Authorization": f"token {access_token}",
                    },
                )

                user_data = user_response.json()

                if user_response.status_code != 200:
                    return jsonify({"message": config.FAILED_TO_AUTH_MESSAGE}), 400
                # ユーザーのemailを取得
                email_response = requests.get(
                    f"{self.api_base_url}/user/emails",
                    headers={
                        "Authorization": f"token {access_token}",
                        "Accept": "application/vnd.github.v3+json",
                    },
                )

                user_email = email_response.json()[0]["email"]
                user_id = hashlib.sha256(str(user_data["id"]).encode()).hexdigest()
                user_name = user_data["login"]
                print(email_response.json(), "email", user_name, "name")
                if not user_email:
                    raise ValueError("メールアドレスが見つかりません")

                result = db["user"].find_one({"id": user_id})

                if result:
                    ip_address = request.remote_addr
                    user_agent = request.headers.get("User-Agent")
                    response = cookie_manager().set_cookie_response(
                        user_id=user_id,
                        ip_address=ip_address,
                        user_agent=user_agent,
                        redirect_url="/",
                    )
                    return response

                if not result:
                    user_id = user_id
                    password = None
                    user().create_save(
                        user_id,
                        user_name,
                        user_email,
                        password,
                        user_type="github",
                    )
                    ip_address = request.remote_addr
                    user_agent = request.headers.get("User-Agent")
                    response = cookie_manager().set_cookie_response(
                        user_id=user_id,
                        ip_address=ip_address,
                        user_agent=user_agent,
                        redirect_url="/",
                    )
                    return response
                else:
                    return jsonify({"message": "エラーが発生しました"}), 500

            except Exception as e:
                print(e)
                # エラーページへとリダイレクト
                return jsonify({"message": "エラーが発生しました"}), 500

        except (
            requests.exceptions.HTTPError
        ) as http_err:  # サーバーがからのレスポンスを返した時
            return jsonify({"error": f"HTTP error occurred: {http_err}"}), 500
        except (
            requests.exceptions.RequestException
        ) as req_err:  # レスポンスが有効なjsonを返していない時
            return jsonify({"error": f"Request error occurred: {req_err}"}), 500
        except ValueError as json_err:  # 期待したデーターが帰ってこなかった時
            return jsonify({"error": f"JSON decode error: {json_err}"}), 500

        except Exception as e:
            print(e)
            return jsonify({"error": "error"}), 500
