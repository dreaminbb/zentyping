import os
from dotenv import load_dotenv
from pymongo import MongoClient


class config:
    dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    load_dotenv(dotenv_path)

    URL = os.getenv("URL")
    PORT = 8000
    MONGO_URL = "mongodb://localhost:27017/"
    API_KEY = os.getenv("SERVER_API_KEY", None)
    SEND_PLAY_INFO_API_KEY = os.getenv("SEND_PLAY_INFO_API_KEY", None)
    MONGO_DB_NAME = "mode-typing"
    JWT_SECRET = os.getenv("JWT_SECRET", None)
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", None)
    JWT_EXPIRES_IN = int(os.getenv("JWT_EXPIRES_IN", 200))
    JWT_EXPIRES_IN_REFRESH = int(os.getenv("JWT_EXPIRES_IN_REFRESH", 50))
    COOKIE_EXPIRES_IN_DAY = int(os.getenv("COOKIE_EXPIRES_IN", 30))
    SESSION_EXPIRES_IN = int(os.getenv("SESSION_EXPIRES_IN", 30))
    SERVER_API_KEY = os.getenv("SERVER_API_KEY", None)
    HMAC_SECRET_KEY = os.getenv("HMAC_SECRET_KEY", None)
    NEVER_GONNA_GIVE_YOU_UP_URL = os.getenv("NEVER_GANNA_GIVE_YOU_UP_URL")
    ACCOUNT_URL = f"{URL}/account"
    COOKIE_AGE = 1  # 時間単位
    PIECE = 5

    GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", None)
    GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", None)
    GITHUB_ACCESS_TOKEN_RTL = "https://github.com/login/oauth/access_token"
    GITHUB_AUTHORIZATION_RL = "https://github.com/login/oauth/authorize"
    GITHUB_API_BASE_URL = "https://api.github.com/"
    GITHUB_REDIRECT_URL = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=user:email"
    print(GITHUB_REDIRECT_URL)

    SESSION_DOSENT_EXIST_MESSAGE = "セッションが見つかりません。ログインし直してください。。。"
    ERROE_MESSAGE = "エラーが発生しました、、、"
    USER_NOT_FOUND_MESSAGE = "ユーザーが見つかりません"
    USER_ALREADY_EXISTS_MESSAGE = "ユーザーが既に存在しています"
    USER_CREATED_MESSAGE = "ユーザーが作成されました"
    USER_EMAIL_EXISTS_MESSAGE = "そのメールアドレスはすでに登録されています"
    USER_NAME_EXISTS_MESSAGE = "その名前はすでに登録されています"
    INVALID_TOKEN_MESSAGE = "ん？......"
    TOKEN_NOT_FOUND_MESSAGE = "ログインし直してください....ごめんぴょ"
    TOKEN_OWNER_NOT_FOUND_MESSAGE = "ログインし直してください....ごめんぴょ"
    TOKEN_TIMEOUT_MESSAGE = "ログインし直してください....ごめんぴょ"
    FAILED_TO_AUTH_MESSAGE = "認証に失敗しました🙁"
    SESSION_TIMEOUT_MESSAGE = "セッションが途切れました"
    TOO_MUCH_REQUEST_MESSAGE = "ちょ、ちょ、っま、、、あ"


db = MongoClient(config.MONGO_URL)[config.MONGO_DB_NAME]
