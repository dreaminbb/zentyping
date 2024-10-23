def test_get_ranking():
    import requests

    response = requests.get(
        "http://localhost:8000/user/ranking",
        json={"level": "short", "range_from": 0, "range_to": 1},
    )
    assert response.status_code == 200
    assert response.json()["message"] == "ランキングを取得しました。"
    assert response.json()["value"] is not None