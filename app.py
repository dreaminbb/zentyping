from app.config import config
from app.main import app 

if __name__ == "__main__":
    app.run(
        debug=True, host="0.0.0.0", port=config.PORT
    )  # デバッグモード(True)  # 本番環境ではFalse(セキュリティ上の問題)