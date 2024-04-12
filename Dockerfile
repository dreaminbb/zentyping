# ベースとなるDockerイメージを指定
FROM python:3.9-slim-buster as build

# ワーキングディレクトリを設定
WORKDIR /app

# Pythonの依存関係をコピー
COPY ./backend/requirements.txt .

# Pythonの依存関係をインストール
RUN pip install -r requirements.txt


# ビルドステージ
FROM node:14 as frontend

WORKDIR /app

# フロントエンドの依存関係をコピー
COPY ./package*.json ./

# フロントエンドの依存関係をインストール
RUN npm install

# フロントエンドのコードをコピー
COPY ./src .
COPY ./backend .

# ビルドコマンドを実行
RUN npm run build