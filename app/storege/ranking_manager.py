import cachetools
import schedule
from cachetools import TTLCache
from ..config import db, config, ranking_cache


class fetch_ranking:

    def __init__(self) -> None:
        pass

    @staticmethod
    async def fetch_ranking_from_db_to_list(fetch_one_level: str) -> list | None:

        # dbからデータを取得 一人一人のデータ + プロフィール情報
        if fetch_one_level not in ["short", "normal", "long"]:
            raise ValueError("不正なレベル名")

        try:
            # データの形  [ ranking_info: [{name: "名前" + プレイ情報 }], client_info: { short : '自信の順位} ... ]
            best_play_lists = []
            query = {f"best_score_{fetch_one_level}": {"$exists": True}}
            doc = db["user"].find(query)
            for user in doc:
                user_best_play_obj: dict = user.get(f"best_score_{fetch_one_level}")
                user_profile_obj: dict = user.get("profile")
                if (
                    user_best_play_obj is None or user_profile_obj is None
                ):  # エラー関係なし
                    continue  # エラー関係なし

                # プレイ情報  + ユーザーの名前 {"name" : 名前}

                user_best_play_obj["name"] = user_profile_obj.get("name")
                added_user_name: dict = user_best_play_obj
                best_play_lists.append(added_user_name)
            print("this", fetch_one_level, "ranking data is fetched")
            sorted(
                best_play_lists, key=lambda x: x["input_per_second_num"], reverse=True
            )

            for ranking in best_play_lists:
                ranking["ranking"] = best_play_lists.index(ranking)

            # ソート
            return best_play_lists
        except Exception as e:
            print("fetch_ranking_data_from_dbのtry文 ", f"Error: {e}")
            return None

    @staticmethod
    def fetch_user_around(target_user_name: str, level: str) -> list:
        target_aroud = []
        target_chache = ranking_cache[level]
        if target_user_name is not None:
            for user in target_chache:
                if user["name"] == target_user_name:
                    # そもそもフロントエンドで確認するから50位以内のリクエストは来ない
                    index: int = target_chache.index(user)
                    front = index - 20
                    
                    end:int = index
                    if index +20 is len(target_chache):
                        end = index
                    elif index + 20 > len(target_chache):
                        end =len(target_chache)
                    target_aroud = target_chache[front:end]
                    break
        return target_aroud

    @staticmethod
    def fetch_ranking_by_renge(start: int, end: int, level: str) -> list:
        # if start or end or level is None:
        #     raise None
        return ranking_cache[level][start:end]
