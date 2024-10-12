import os
import math
import datetime
import hashlib
import traceback
from flask import Response, request, make_response
from typing import Optional
from bson import json_util
from app.config import db
import json
from .auth import jwt_manager

# todo
# ランキング機能の実装
# マジでお姉さんのおっぱいに埋もれたい
#メモ




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
            user_profile = {
                "id": user_id,
                "type": user_type,
                "email": email,
                "password": hashed_password,
                "created_at": datetime.datetime.now().isoformat(),
                "access_at": datetime.datetime.now().isoformat(),
                "updated_at": datetime.datetime.now().isoformat(),
                "role": {"admin": True},
                "profile": {
                    "icon": None,
                    "level": 0,
                    "read_me": "",
                    "name": name,
                    "keyboard": "",
                    "github_link": "",
                    "twitter_link": "",
                },
                "activity_calender": [],
                "comprehensive_results": {
                    "play_count": 0,
                    "completed_play_count": 0,
                    "total_time": 0.0,
                    "short_correct_rate": 0.0,
                    "normal_correct_rate": 0.0,
                    "long_correct_rate": 0.0,
                },
                "play_history": {"short": [], "normal": [], "long": []},
                "best_score_short": None,
                "best_score_normal": None,
                "best_score_long": None,
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

    @staticmethod
    def get_user_info(access_token: Optional[str]) -> Optional[dict]:
        try:
            if access_token:
                validated_token: dict = jwt_manager().verify_token(
                    jwt_token=access_token
                )
                print(validated_token, "検証されたトークン")
                if validated_token["user_id"] is not None:
                    user_info = db["user"].find_one({"id": validated_token["user_id"]})
                    if user_info is not None:
                        print(user_info, "ユーザー情報")
                        """ユーザー情報のペイロード"""
                        return_value: dict = {
                            "success": True,
                            "joined_day": user_info["created_at"],
                            "user_read_me": user_info["profile"]["read_me"],
                            "user_name": user_info["profile"]["name"],
                            "icon": user_info["profile"]["icon"],
                            "keyboard": user_info["profile"]["keyboard"],
                            "github_link": user_info["profile"]["github_link"],
                            "twitter_link": user_info["profile"]["twitter_link"],
                            "activity_calender": user_info["activity_calender"],
                            "play_history": user_info["play_history"],
                            "play_count": user_info["comprehensive_results"][
                                "play_count"
                            ],
                            "completed_play_count": user_info["comprehensive_results"][
                                "completed_play_count"
                            ],
                            "total_time": user_info["comprehensive_results"][
                                "total_time"
                            ],
                            "short_correct_rate": user_info["comprehensive_results"][
                                "short_correct_rate"
                            ],
                            "normal_correct_rate": user_info["comprehensive_results"][
                                "normal_correct_rate"
                            ],
                            "long_correct_rate": user_info["comprehensive_results"][
                                "long_correct_rate"
                            ],
                            "status": 200,
                        }
                        """profileの中身"""
                        # {
                        # "icon": null,
                        # "level": newNumberInt( "0"),
                        # "read_me": "",
                        # "name": "dreaminbb",
                        # "keyboard": "",
                        # "github_link": "",
                        # "twitter_link": ""
                        # }
                        """comprehensive_resultsの中身"""
                        # {
                        # "play_count": new NumberInt("0"),
                        # "completed_play_count": new NumberInt("0"),
                        # "total_time": 0,
                        # "short_correct_rate": 0,
                        # "normal_correct_rate": 0,
                        # "long_correct_rate": 0
                        # }
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
                if validated_token["user_id"] is None:
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
            traceback.print_exc()
            error_value: dict = {
                "success": False,
                "user_info": None,
                "status": 500,
            }
            print("エラーだお")
            return error_value


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

            return Response(
                json.dumps([short_doc, normal_doc, long_doc], ensure_ascii=False),
                mimetype="application/json",
            )

        except Exception as e:
            print(e)
            return make_response({"message": "サーバーでエラーが発生しました"}, 500)

    """ユーザーのアクティブ日のデーターをどのようにして保管するかフロントエンドのカレンダーの書き方に依存してくる"""

    # play_info = クライアント側から送信されたプレイデーター
    # user_info = DBから取得したユーザーのプレイデーター

    """=======================フロントエンドからのペイロード========================"""
    """" {
         id: pbm_id.value,
         level: level.value,
         time: Number((time.value * 10) / 10),
         correct_rate: correct_rate.value,
         correct_count: correct_count.value,
         incorrect_count: type_input.value.length - correct_count.value,
         input_per_second_arr: input_per_second_arr.value,
         correct_per_second: correct_per_second.value,
         length: char.value.length,
         pun_count: pun_count.value
         }"""

    # 　ランキングのこDBをこう更新する

    @staticmethod
    def save_result(access_token: str, play_info: dict) -> bool | None:
        try:
            token_result = jwt_manager().verify_token(access_token)
            user_id = token_result["user_id"]

            is_exist_session = db["session"].find_one({"user_id": user_id})
            user_info = db["user"].find_one({"id": user_id})

            if is_exist_session and user_info:
                level = play_info["level"]
                play_info["played_at"] = datetime.datetime.now().strftime("%Y-%m-%d")

                """ユーザーDBのプレイデータ"""
                # "comprehensive_results": {
                #     "play_count": 0,
                #     "completed_play_count": 0,
                #     "total_time": 0,
                #     "short_correct_rate": 0,
                #     "normal_correct_rate": 0,
                #     "long_correct_rate": 0
                # },

                # "play_history": [
                # 'short': [],
                # 'normal': [],
                # 'long': []
                # ]

                """DBに保管してあるプレイデータの抽出"""
                play_history: list = user_info["play_history"]

                comprehensive_results: dict = user_info["comprehensive_results"]
                comprehensive_results["play_count"] += 1
                tmp: dict = {"play_count": comprehensive_results["play_count"]}
                play_info.update(tmp)
                user_info["play_history"][level].append(play_info)
                print(user_info["play_history"][level])
                comprehensive_results["total_time"] += play_info["time"]

                # 　最高スコアの更新　　　初めてならそのまま使用

                if user_info[f"best_score_{level}"] == None or {}:
                    print("初めてのプレイ")
                    user_info[f"best_score_{level}"] = play_info
                elif (
                    user_info[f"best_score_{level}"]["input_per_second_num"]
                    < play_info["input_per_second_num"]
                ):
                    print("最高記録更新")
                    user_info[f"best_score_{level}"] = play_info

                elif (
                    user_info[f"best_score_{level}"]["input_per_second_num"]
                    > play_info["input_per_second_num"]
                ):
                    print("最高記録更新ならずお疲れカス")

                # 平均正入力を計算するアルゴリズム
                # print(user_info['play_history'])
                history_of_each_level = user_info["play_history"][level]
                level_len = len(history_of_each_level)
                # print(level_len, history_of_each_level)
                # レベル別の全てのcorrect　rateを集めた配列を作成してsumで全てを足している
                level_sum = sum(
                    [entry["correct_rate"] for entry in history_of_each_level]
                )

                level_ave = math.floor((level_sum / level_len) * 10) / 10
                comprehensive_results[f"{level}_correct_rate"] = level_ave

                # その日のプレイ回数を記録する
                activity_calender: list = user_info["activity_calender"]
                today = datetime.datetime.now().strftime("%Y-%m-%d")
                week_number = datetime.datetime.now().isocalendar()[1]
                day_of_week = datetime.datetime.now().strftime("%a")

                """もし今日の日付のデータがなかったら新しく配列に挿入"""
                if not any(d["day"] == today for d in activity_calender):
                    tmp = {
                        "day": today,
                        "week_number": week_number,
                        "day_of_week": day_of_week,
                        "play_count_in_day": 1,
                    }
                    activity_calender.append(tmp)
                else:
                    for day in activity_calender:
                        if day["day"] == today:
                            day["play_count_in_day"] += 1

                """DBに更新するデーター"""
                new_play_history_value: dict = {
                    "$set": {
                        "play_history": play_history,  # ペイロードに含まれてくωωる情報
                        "comprehensive_results": comprehensive_results,
                        "activity_calender": activity_calender,
                        f"best_score_{level}": user_info[f"best_score_{level}"],
                    }
                }
                db["user"].find_one_and_update({"id": user_id}, new_play_history_value)

                return True
            else:
                return None

        except Exception as e:
            print(e)
            traceback.print_exc()
            return False
