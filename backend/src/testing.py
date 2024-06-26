import os
import jwt
from jwt import encode, decode
import datetime
import uuid
from flask import Response, redirect, Blueprint, make_response, request
from flask import Flask, jsonify
import requests
import hashlib
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import json_util
import json
#
# try:
#     dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
#     load_dotenv(dotenv_path)
# except Exception as e:
#     print("Failed to load .env file in main", e)
#
#
# class user:
#
#     def __init__(self) -> None:
#         self.secret = os.getenv("JWT_SECRET")
#         self.time = int(os.getenv("JWT_EXPIRES_IN"))
#         self.algorithm = os.getenv("JWT_ALGORITHM")
#         self.user_id = str(uuid.uuid4())
#
#     def generate(self):
#
#         jwt_token = jwt.encode(
#             {
#                 "user_id": self.user_id,
#                 "exp": datetime.datetime.utcnow()
#                 + datetime.timedelta(minutes=self.time),
#             },
#             self.secret,
#             algorithm=self.algorithm,
#         )
#         return jwt_token
#
#
# a = user().generate()
# print((a))
\\

