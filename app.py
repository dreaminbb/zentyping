from app import create_app
from dotenv import load_dotenv
import os

# 本番環境で変更すること
# cookieの設定(Secure HTTPOnly)

dotenv_path = os.path.join(os.path.dirname(__file__), ".", ".env")
load_dotenv(dotenv_path)

app = create_app()

if __name__ == "__main__":
    app.run(
        debug=True, host="0.0.0.0", port=int(os.getenv("port", 8000))
    )  # デバッグモード(True)  # 本番環境ではFalse(セキュリティ上の問題)
