import pytest
import schedule
import sys
import os
import asyncio
from cachetools import TTLCache

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from app.storege.ranking_manager import fetch_ranking
from app.config import config


# ranking_cache = TTLCache(
    # maxsize=config.RANKING_STOREGE_MAX_SIZE,
    # ttl=config.RANKING_STOREGE_EXPIRES_IN,
# )
# pytest -s でprint文が出力される
@pytest.mark.asyncio
async def test_cashing():
    try:
        ins = fetch_ranking()
        # print(await ins.ranking_cache["short"] , await ins.ranking_cache["normal"], await ins.ranking_cache["long"])
        short = await ins.ranking_cache["short"]
        normal = await ins.ranking_cache["normal"]
        long = await ins.ranking_cache["long"]
        if short == None or normal == None or long == None:
            assert False

        assert True
    except Exception as e:
        print(f"Error: {e}")
        assert False
