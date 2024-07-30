import os
from app import db
import datetime
import hashlib
from flask import Response, request, make_response
from typing import Optional, Union, Any
from .auth import jwt_manager
from bson import json_util
from app import db
import json
from .auth import jwt_manager


class user:

    def __init__(self) -> None:

        self.access_token: Optional[str] = request.cookies.get("access_token")
        self.session_id: Optional[str] = request.cookies.get("session_id")
        self.salt = os.urandom(32)
        pass

    def create_save(
        self,
        user_id: str,
        email: str | None,
        password: str | None,
        name: str | None,
        user_type: str | None,
    ) -> bool:
        try:
            # ここでパスワードをハッシュ化して適切なJSONに変換している
            if password is not None:
                hashed_password = (
                    hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8")
                    + self.salt
                )
            else:
                hashed_password = None

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
                "profile": {"icon": None, "bio": "", "name": name},
                # ======辞書にして一つにまとめようとしたけど操作がややこしくなるので中止=========
                "play_count": 0,
                "total_time": 0,
                "short": [],
                "normal": [],
                "long": [],
                "short_pun": [],
                "normal_pun": [],
                "long_pun": [],
            }

            db["user"].insert_one(user_profile)
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

    def get_user_info(self, access_token: Optional[str]) -> Optional[dict]:
        try:
            if access_token:

                valited_token: dict = jwt_manager().verify_token(jwt_token=access_token)
                print(valited_token)
                if valited_token["user_id"] is not None:
                    user_info = db["user"].find_one({"id": valited_token["user_id"]})
                    if user_info is not None:
                        return_value: dict = {
                            "success": True,
                            "name": user_info["profile"]["name"],
                            "bio": user_info["profile"]["bio"],
                            "created_at": user_info["created_at"],
                            "total_time": user_info["total_time"],
                            "play_history": {
                                "short": user_info["short"],
                                "normal": user_info["normal"],
                                "logn": user_info["long"],
                            },
                            "status": 200,
                        }
                        print(return_value, "期待しているレスポンス")
                        return return_value
                    else:
                        return {
                            "success": False,
                            "name": None,
                            "bio": None,
                            "play_history": None,
                            "status": 404,
                        }

                if valited_token["user_id"] is None:
                    invalid_token: dict = {
                        "success": False,
                        "auth": False,
                        "user_info": None,
                        "message": "ログインし直してください",
                        "status": 401,
                    }
                    print(invalid_token, "無効なトークン")
                    return invalid_token

        except Exception as e:
            print(e)
            erroe_value: dict = {
                "success": False,
                "user_info": None,
                "status": 500,
            }
            print("エラーだお")
            return erroe_value


class play:

    def __init__(self):
        self.piece: int = 5

    def get_problem(self):
        try:
            short_doc = [
                json.loads(json_util.dumps(document))
                for document in db["short"].aggregate(
                    [{"$sample": {"size": self.piece}}]
                )
            ]
            normal_doc = [
                json.loads(json_util.dumps(document))
                for document in db["normal"].aggregate(
                    [{"$sample": {"size": self.piece}}]
                )
            ]
            long_doc = [
                json.loads(json_util.dumps(document))
                for document in db["long"].aggregate(
                    [{"$sample": {"size": self.piece}}]
                )
            ]
            print(self.piece)

            print(json.dumps([short_doc, normal_doc, long_doc], ensure_ascii=False))

            return Response(
                json.dumps([short_doc, normal_doc, long_doc], ensure_ascii=False),
                mimetype="application/json",
            )

        except Exception as e:
            print(self.piece)
            print((e))
            return make_response({"message": "サーバーでエラーが発生しました"}, 500)

    # play_info = クライアント側から送信されたプレイデーター
    # user_info = DBから取得したユーザーのプレイデーター
    def save_result(self, access_token: str, play_info: dict) -> bool | None:
        try:
            token_result = jwt_manager().verify_token(access_token)
            user_id = token_result["user_id"]
            print(user_id)

            is_exist_session = db["session"].find_one({"user_id": user_id})
            user_info = db["user"].find_one({"id": user_id})

            if is_exist_session and user_info:
                print("penis")
                level = play_info["level"]
                play_info["played_at"] = datetime.datetime.now().isoformat()
                play_history: list = user_info[level]
                updated_time: int = user_info["total_time"] + int(play_info["time"])
                play_history.append(play_info)
                new_play_history_value: dict = {
                    "$set": {level: play_history},
                    "$set": {"total_time": updated_time},
                    "$set": {"play_count": user_info["play_count"] + 1},
                }
                db["user"].find_one_and_update({"id": user_id}, new_play_history_value)
                return True

            else:
                return None

        except Exception as e:
            print(e)
            return False
