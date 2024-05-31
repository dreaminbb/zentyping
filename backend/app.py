from flask import Response
from flask import Flask, jsonify
from flask_cors import CORS

from pymongo import MongoClient
from bson.objectid import ObjectId
import json
from bson import json_util
from waitress import serve

app = Flask(__name__)
CORS(
    app
)  # 異なるオリジン（簡単に言えばURL）あらのアクセスはブラウザ側のセキュリティイ関係でブロックされているのでこれでそれを解除しなければならない

client = MongoClient("mongodb://localhost:27017/")
db = client["mode-typing-problem-db"]
short_collection = db.short
normal_collection = db.normal
long_collection = db.long


try:
    client.admin.command("ismaster")
    print("MongoDB connection successful in main")
except Exception as e:
    print("MongoDB connection failed in main", e)


@app.route("/problem", methods=["GET"])
def get_problem():
    try:
        piece = 5
        short_doc = [
            json.loads(json_util.dumps(document))
            for document in db["short"].aggregate([{"$sample": {"size": piece}}])
        ]
        normal_doc = [
            json.loads(json_util.dumps(document))
            for document in db["normal"].aggregate([{"$sample": {"size": piece}}])
        ]
        long_doc = [
            json.loads(json_util.dumps(document))
            for document in db["long"].aggregate([{"$sample": {"size": piece}}])
        ]

        return Response(
            json.dumps([short_doc, normal_doc, long_doc], ensure_ascii=False),
            mimetype="application/json",
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=8000)
    # app.run(debug=True)  # 本番環境ではFalse(セキュリティ上の問題)
