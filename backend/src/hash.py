# import hashlib

# # ハッシュ化したい文字列
# data_problem = "modetypig_api_key_getting_problem"


# # 文字列をバイト列に変換
# data_bytes = data_problem.encode()

# # SHA256ハッシュを生成
# hash_object = hashlib.sha256(data_bytes)

# # ハッシュを16進数の文字列として取得
# hex_dig = hash_object.hexdigest()


# print(hex_dig)


import hashlib

# ハッシュ化したい文字列
data_problem = "modetypig_api_key_signin_github"


# 文字列をバイト列に変換
data_bytes = data_problem.encode()

# SHA256ハッシュを生成
hash_object = hashlib.sha256(data_bytes)

# ハッシュを16進数の文字列として取得
hex_dig = hash_object.hexdigest()


print(hex_dig)

