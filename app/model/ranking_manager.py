from app.model.user import user
from ..config import db
import redis
import pymongo


class fetch_ranking:

    async def get_ranking_from_db_to_list(self, fetch_one_level: str)-> list | None:

        # dbからデータを取得 一人一人のデータ + プロフィール情報
        if fetch_one_level not in ["short", "normal", "long"]:
            raise ValueError("不正なレベル名")

        try:
            # データの形  [ {name: "名前", プレイ情報}, ... ]
            best_play_lists = []
            query  = {f"best_score_{fetch_one_level}": {"$exists": True}}
            doc = db["user"].find(query)
            for user in doc:
                if user[f"best_score_{fetch_one_level}"]:
                   user_best_play_obj = user[f"best_score_{fetch_one_level}"]
                   user_profile_obj = user["profile"]
                   #プレイ情報  + ユーザーの名前 {"name" : 名前}
                   user_best_play_obj["name"] = user_profile_obj["name"]
                   added_user_name = user_best_play_obj
                   best_play_lists.append(added_user_name)
            
            return best_play_lists
        except Exception as e:
            print(f"Error: {e}")
            return None