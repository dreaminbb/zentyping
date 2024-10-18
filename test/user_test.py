import pytest
import schedule
import sys
import os
import asyncio
from cachetools import TTLCache

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from app.storege.ranking_manager import fetch_ranking , ranking_cache

#pytest -s でprint文が出力される
@pytest.mark.asyncio
async def test_cashing():
    try:
        for level in ["short", "normal", "long"]:
            tmp = await fetch_ranking().fetch_ranking_from_db_to_list(level)
            print(f"Data size for level {level}: {sys.getsizeof(tmp)} bytes")
            if tmp is None:
                raise ValueError("tmp is None")
        assert True
    except Exception as e:
        print(f"Error: {e}")
        assert False