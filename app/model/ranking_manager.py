from ..config import db
import redis


class fetch_ranking:

    def __init__(self) -> None:
       self.user_client = db

    async def get_ranking_from_db_to_list(self, fetch_one_level: str)-> list | None:


        # dbからデータを取得 一人一人のデータ + プロフィール情報
        try:
           doc = db['user'].find({f"best_score_{fetch_one_level}": {"$exists": True}}, {"_id": 0, "profile": 1, f"best_score_{fetch_one_level}": 1}).sort({f"best_score_{fetch_one_level}":    -1 ,"user":1})
           
           user_best_play_list:list= []
           for doc in doc:
               user_best_play_list.append(doc)

           return user_best_play_list
        except Exception as e:
            print(f"Error: {e}")
            return None