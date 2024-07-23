from app import db
import datetime


class recorder:

    def __init__(self) -> None:
        pass

    @staticmethod
    def access_at(user_id: str) -> None:
        try:
            print(user_id)
            query = {"id": user_id}
            update_value = {"$set": {"access_at": datetime.datetime.now()}}

            result = db["user"].find_one_and_update(
                query, update_value, return_document=True
            )

            if result:
                print("access at was updated")
                return
            if not result:
                print('no user')
                return
            
    # @staticmethod
    # def user_exit(user_id:str)->None:
    #     find_result = db["user"].find_one({"id":user_id})
    #     if find_result:
    #         find_result[""]



        except Exception as e:
            print(e)
            return
        
    