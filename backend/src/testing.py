import os
import jwt
from typing import Union
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

# salt = uuid.uuid4().hex
# hash_password = hashlib.sha256(salt.encode() + "password".encode())
# print(hash_password)

a = "2d83d69572189c34a12298ca1c73bf37ecee407a7509d985f34ac8f86bc88a5a"
a = a.replace("2", "")
print(a)