import random , readline
import uuid

i = 0
while i < 100:  # 例として100回のループで終了するように設定
    uuid1 = random.randrange(0, 100)
    uuid2 = random.randrange(0, 100)
    print("generating random numbers")
    print(i)
    if uuid1 == uuid2:
        print("uuid1 == uuid2")
    i += 1  # iをインクリメントしてループの進行を追跡
