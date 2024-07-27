from flask import Response, make_response
import json
import datetime
from bson import json_util
from app import db
from app.model.auth import jwt_manager


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

    def save_result(self, access_token: str, play_info: dict) -> bool | None:
        try:
            token_result = jwt_manager().verify_token(access_token)
            user_id = token_result["user_id"]
            print(user_id)

            is_exist_session = db["session"].find_one({"user_id": user_id})
            is_exist_user = db["user"].find_one({"id": user_id})

            if is_exist_session and is_exist_user:
                level = play_info["level"]
                play_info["played_at"] = datetime.datetime.now().isoformat()
                user_info = db["user"].find_one({"id": user_id})
                play_history: list = user_info[level]
                play_history.append(play_info)
                new_play_history_value: dict = {"$set": {level: play_history}}
                db["user"].find_one_and_update({"id": user_id}, new_play_history_value)
                return True

            else:
                return None

        except Exception as e:
            print(e)
            return False
