import uuid
import os
import sys
import random
import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from app.config import db


def generate_play_history(mount: int, level: str):
    id = random.randint(1, 30)
    level = level
    play_count = mount
    time = random.uniform(0.0, 100.0)
    correct_count = random.randint(0, 100)
    incorrect_count = random.randint(0, 100)
    correct_rate = random.uniform(0.0, 100.0)
    input_per_second: list = [random.uniform(0.0, 1.0) // 0.1 / 10 for i in range(20)]
    input_per_second_num = random.uniform(0.0, 4.0) // 0.1 / 10
    correct_per_second: list = [random.uniform(0.0, 1.0) // 0.1 / 10 for i in range(20)]
    pun_count = random.randint(0, 10)
    length = random.randint(20, 100)
    played_at = datetime.datetime.now().isoformat()
    return {
        "id": id,
        "level": level,
        "play_count": play_count,
        "time": time,
        "correct_count": correct_count,
        "incorrect_count": incorrect_count,
        "correct_rate": correct_rate,
        "input_per_second": input_per_second,
        "input_per_second_num": input_per_second_num,
        "correct_per_second": correct_per_second,
        "pun_count": pun_count,
        "length": length,
        "played_at": played_at,
    }


def add_ramdom_user(mount: int):
    print(f"{mount}個のユーザーサンプルデータ作成開始")
    for i in range(mount):
        print(f"{i+1}個目のユーザーサンプルデータ作成中")
        type_arr = random.choice(["native", "google", "github"])
        user_id: str = str(uuid.uuid4())
        user_name: str = f"test_user_{mount}"
        password = "test_password"
        random_email = f"{mount}@gmail.com"
        email = random_email
        short_history = []
        for i in range(random.randint(5, 10)):
            short_history.append(generate_play_history(i, "short"))

        normal_history = []
        for i in range(random.randint(5, 10)):
            normal_history.append(generate_play_history(i, "normal"))

        long_history = []
        for i in range(random.randint(5, 10)):
            long_history.append(generate_play_history(1, "long"))
            
        user_type = random.choice(["native", "google", "github"])

        user_profile = {
            "id": user_id,
            "type": user_type,
            "email": email,
            "password": password,
            "created_at": datetime.datetime.now().isoformat(),
            "access_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(),
            "role": {"admin": True},
            "profile": {
                "icon": None,
                "level": 0,
                "read_me": "",
                "name": user_name,
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
            "play_history": {
                "short": short_history,
                "normal": normal_history,
                "long": long_history,
            },
            "best_score_short": short_history[1],
            "best_score_normal": normal_history[1],
            "best_score_long": long_history[1],
        }
        db["user"].insert_one(user_profile)
    print(f"{mount}個のユーザーサンプルデータ作成完了")


add_ramdom_user(10)