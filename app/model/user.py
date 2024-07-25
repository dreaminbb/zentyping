import os
from app import db
import datetime
import hashlib
from flask import jsonify, Response


class user:

    def create_save(
        self,
        user_id: str,
        email: str | None,
        password: str | None,
        name: str | None,
        user_type: str | None,
    ) -> bool:
        try:
            salt = os.urandom(32)
            # ここでパスワードをハッシュ化して適切なJSONに変換している
            if password is not None:
                hashed_password = (
                    hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8")
                    + salt
                )

            # ユーザーIDの生成
            user_profile = {
                "id": user_id,
                "type": user_type,
                "email": email,
                "password": hashed_password,
                "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "access_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "role": {"user": True},
                "play_info": {"total_play": 0, "total_time": 0},
                "profile": {"icon": None, "bio": None, "name": name},
                "play_history": {
                    "short": [],
                    "normal": [],
                    "long": [],
                    "short_pun": [],
                    "normal_pun": [],
                    "long_pun": [],
                },
            }

            db["user"].insert_one(user_profile)
            print("its saved!!!")
            return True
        except Exception as e:
            print(e)
            return False

    @staticmethod
    def find_by_email(email: str) -> bool | None:
        try:
            query = {"email": email}
            result = db["user"].find_one(query)
            if result:
                return True
            if not result:
                return False
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def find_by_id(user_id: str) -> bool | None:
        try:
            query = {"id": user_id}
            result = db["user"].find_one(query)
            if result:
                return True
            if not result:
                return False
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def find_by_name(name: str) -> bool | None:
        try:
            query = {"name": name}
            result = db["user"].find_one(query)
            if result:
                return True
            if not result:
                return False
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def find_and_get_user_info(email: str, user_type: str) -> dict | None:
        try:
            query = {"email": email, "type": user_type}
            result = db["user"].find_one(query)
            if result:
                return result
            if not result:
                return None
        except Exception as e:
            print(e)
            return None

    # def save_play_info(seld, user_id:str)->bool:
    #     try:

    #     except Exception as e:
    #         print(e)
    #         return False
