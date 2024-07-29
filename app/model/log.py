from app import db
import datetime
from typing import Optional


class recorder:

    def __init__(self) -> None:
        pass

    @staticmethod
    def access_time_session_user_db(session_id: Optional[str]) -> None:
        try:
            # sessionコレクションを更新
            query = {"session_id": session_id}
            update_value = {
                "$set": {"last_access_time": datetime.datetime.now().isoformat()}
            }

            update_result = db["session"].find_one_and_update(
                query, update_value, return_document=True
            )

            if update_result:
                # ユーザーコレクションを更新
                user_id = update_result["user_id"]
                print(f"user_id: {user_id}")
                query = {"id": user_id}
                update_value = {
                    "$set": {"access_at": datetime.datetime.now().isoformat()}
                }
                db["user"].find_one_and_update(
                    query, update_value, return_document=False
                )
                return
            if not update_result:
                return

        except Exception as e:
            print(e)
            return
