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

salt = uuid.uuid4().hex
hash_password = hashlib.sha256(salt.encode() + "password".encode())
print(hash_password)
