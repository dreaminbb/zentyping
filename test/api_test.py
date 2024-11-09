import requests
import pytest


@pytest.mark.asyncio
async def test_get_ranking():
    try:
        parameters = {
            "level": "short",
            # "range_from": 0,
            # "range_to": 100,
            "target": "fap_bro",
        }
        response = requests.get(
            "http://localhost:8000/user/ranking",
              params=parameters
        )

        print(response.json())
        assert response.status_code == 200
    except Exception as e:
        print(e)
        assert False
