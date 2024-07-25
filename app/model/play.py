from flask import Response, make_response
import json
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

    def save_result(self, access_token: str, play_info: dict) -> bool:
        token_result = jwt_manager().verify_token(access_token)
        user_id = token_result["user_id"]
        is_exist_session = db["session"].find_one({"user_id": user_id})
        is_exist_user = db["user"].find_one({"id": user_id})
        if is_exist_session and is_exist_user:
            level = play_info["level"]
            before_play_history = is_exist_user["play_history"]
            query = {"id": user_id}
            # update_value = {"$set": {"access_at":}
            db["user"].find_one_and_update
