def test_get_ranking():
    import requests

    response = requests.get(
        "http://localhost:8000/user/ranking",
        json={"level": "short", "range_from": 0, "range_to": 20},
    )
    assert response.status_code == 200
    print(response.json()["value"])
    assert response.json()["value"] is not None
