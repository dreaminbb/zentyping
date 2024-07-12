import os
from dotenv import load_dotenv
from flask import Response, redirect, make_response, request
from pymongo import MongoClient
from flask import Flask, jsonify
import datetime
import uuid
import json
import hashlib
import requests
from flask_cors import CORS
from bson import json_util
from typing import Tuple
import jwt


class github_user:
    client_id = os.getenv("GITHUB_CLIENT_ID")
    redirect_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&scope=user:email"

    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token_url = "https://github.com/login/oauth/access_token"
        self.access_token_params = (None,)
        self.authorize_url = "https://github.com/login/oauth/authorize"
        self.authorize_params = (None,)
        self.api_base_url = "https://api.github.com/"
        self.client_kwargs = {"scope": "user:email"}
        self.client_id = os.getenv("GITHUB_CLIENT_ID")
        self.client_secret = os.getenv("GITHUB_CLIENT_SECRET")
        self.github_oauth = github_user(client_id, client_secret)

    # 認証URLを取得
    def get_url(self, scope: str = "user:email"):
        return f"{self.authorize_url}?client_id={self.client_id}&scope={scope}"

    # アクセストークンを取得
    def get_access_token(self, code: str):
        token_response = requests.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "code": code,
            },
        )

        access_token = token_response.json()["access_token"]
        if not access_token:
            raise ValueError("アクセストークンが見つかりません")

        return access_token

    # ユーザー情報を取得
    def get_user_info(self, accsess_token: str) -> dict:
        user_response = requests.get(
            f"{self.api_base_url}user",
            headers={
                "Authorization": f"token {accsess_token}",
            },
        )
        user_name = user_response.json()["login"]

        if not user_name:
            raise ValueError("ユーザー名が見つかりません")

        return user_name

    # ユーザーのメールアドレスを取得
    def get_user_email(self, access_token: str) -> dict:
        email_response = requests.get(
            f"{self.api_base_url}user/emails",
            headers={
                "Authorization": f"token {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )
        user_primary_email = email_response.json()[0]["email"]
        if not user_primary_email:
            raise ValueError("メールアドレスが見つかりません")

        return user_primary_email
