import json
from flask import jsonify, make_response, Response, redirect, url_for
import requests
import datetime
import uuid
import hashlib
import jwt
from app import config, db
from ..model.user import user


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

    def generate(self, user_id: str, user_type: str) -> tuple[str, str]:

        access_token: str = jwt.encode(
            {
                # "iss": url,
                "sub": user_id,
                "iat": datetime.datetime.now(datetime.timezone.utc),
                "exp": datetime.datetime.now(datetime.timezone.utc)
                + datetime.timedelta(minutes=config.JWT_EXPIRES_IN),
                "role": "user",
                "type": user_type,
            },
            key=self.key,
            algorithm=self.algorithm,
        )

        refresh_token: dict = {
            "iss": self.url,
            "sub": user_id,
            # "aud": os.getenv("URL"),
            "exp": datetime.datetime.now(datetime.timezone.utc)
            + datetime.timedelta(days=self.expires_in_refresh),
            "type": user_type,
            "jti": self.jti,
        }

        encoded_refresh_token: str = jwt.encode(
            refresh_token, key=self.key, algorithm=self.algorithm
        )

        self.token_be_invalid(token=refresh_token)

        db["refresh_token"].find_one_and_delete({"sub": user_id})
        db["refresh_token"].insert_one(refresh_token)

        return access_token, encoded_refresh_token

    def verify_token(self, jwt_token: str) -> dict:
        print(jwt_token)
        if not jwt_token:
            print("no token")
            return {"no_token": True}

        try:
            payload = jwt.decode(jwt_token, key=self.key, algorithms=[self.algorithm])
            print(payload["sub"], "sub sub sub")
            return {"success": True, "id": payload["sub"], "type": payload["type"]}

        except jwt.ExpiredSignatureError:
            db["invalid_tokens"].insert_one(
                {
                    "token": jwt_token,
                    "detected_at": datetime.datetime.now(datetime.timezone.utc),
                }
            )
            return {"timeout": True}

        except jwt.InvalidTokenError:
            db["invalid_tokens"].insert_one(
                {
                    "token": jwt_token,
                    "detected_at": datetime.datetime.now(datetime.timezone.utc),
                }
            )
            print("invalid token")
            return {"invalid": True}

        except Exception as e:
            print(e, "this is why the error happend")
            return {"error": True}

    def token_be_invalid(self, token: dict) -> None:
        old_token = db["refresh_token"].find_one(token)
        if old_token:
            db["invalid_tokens"].insert_one(old_token)
            db["refresh_token"].delete_one(old_token)
            return
        else:
            return

    # 0 = access token , 1 = refresh token

    def cookie_verify_and_update_token(self, cookie: str | None) -> Response:
        if not cookie:
            return make_response({"message": config.SESSION_TIMEOUT_MESSAGE})

        cookie_value = cookie.replace("=", "").replace("'", '"')
        json_cookie = json.loads(cookie_value)
        access_token = json_cookie["access_token"]

        return make_response({"message": config.ERROE_MESSAGE})


class cookie_maneger:
    def token_essencer(self, cookie) -> tuple[str, str]:
        cookie_value = cookie.replace("=", "").replace("'", '"')
        json_cookie = json.loads(cookie_value)
        access_token: str = json_cookie["access_token"]
        refresh_token: str = json_cookie["refresh_token"]
        return access_token, refresh_token

    def make_cookie(self, user_id: str, user_type: str) -> dict:
        access_token = jwt_manager().generate(user_id, user_type)[0]
        encoded_refresh_token = jwt_manager().generate(user_id, user_type)[1]

        return {
            "access_token": access_token,
            "refresh_token": encoded_refresh_token,
            # "type": user_type,
            # "path": "/",
            # "httponly": True,
            # "Secure": True,
            # "sameSite": "None",
        }


class native:

    @staticmethod
    def login(email: str, password: str) -> tuple[Response, int]:
        try:
            print(email, password)
            user = db["user"].find_one({"email": email})

            if not user:
                return jsonify({"message": "ユーザーが見つかりません"}), 404

            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            decoded_password = user["password"][:64].decode("utf-8")

            if decoded_password == hashed_password:
                print("correct password")
                new_cookie = jwt_manager().make_cookie(
                    user_id=user["id"], user_type=user["type"]
                )
                return jsonify({"new_cookie": new_cookie}), 200

            else:
                print("incorrect password", 401)
                return (
                    jsonify({"message": "パスワードまたはメールアドレスが違います"}),
                    401,
                )

        except Exception as e:
            print(e)
            return jsonify({"error": "error"}), 500


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
                user_id = str(user_data["id"])
                user_name = user_data["login"]
                if not user_email:
                    raise ValueError("メールアドレスが見つかりません")

                result = user().find_by_all(
                    user_email=user_email, user_name=user_name, user_id=user_id
                )

                if result:
                    cookie = str(
                        cookie_maneger().make_cookie(
                            user_id=user_id, user_type="github"
                        )
                    )
                    print("you are not first time men")

                    if config.URL is not None:
                        response = make_response(redirect(config.URL))
                        response.set_cookie(cookie)
                        print(response.set_cookie)
                        return response
                    else:
                        return jsonify({"message": "エラーが発生しました"}), 500

                if not result:
                    password = None
                    print("you are virgin")
                    user().create_save(
                        user_id, user_name, user_email, password, user_type="github"
                    )
                    cookie = str(
                        jwt_manager().make_cookie(user_id=user_id, user_type="github")
                    )
                    if config.URL:
                        response = make_response(redirect(config.URL))
                        response.set_cookie(cookie)
                        print(response.set_cookie)
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
