FROM ubuntu:22.04 as base

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    echo "Asia/Tokyo" > /etc/timezone && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Rust のビルドステージ
FROM rust:1.75-slim as builder

WORKDIR /app

RUN for i in 1 2 3; do cargo fetch && break || sleep 5; done

COPY src ./src
COPY static ./static
COPY .env ./.env

# 作業ディレクトリを設定
WORKDIR /app
# Rust ツールチェーンを明示的に設定
RUN rustup default stable

# 必要なパッケージをインストール（ビルド専用）
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Cargo の依存関係をキャッシュするため、先に Cargo の設定をコピー
COPY Cargo.toml Cargo.lock ./
RUN cargo build --release

# 実行環境（最適化）
FROM ubuntu:22.04

RUN apt update && apt install -y libc6

# 必要なランタイムパッケージのみインストール
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# main.rs をコンパイラ
COPY --from=builder /app /app

# 作業ディレクトリ
# ポートを開放
EXPOSE 8000

CMD ["/app/target/release/server"]
