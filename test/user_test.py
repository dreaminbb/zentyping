from _pytest.config.exceptions import PrintHelp
import pytest
import sys
import os
import asyncio

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from app.model.ranking_manager import fetch_ranking

#pytest -s でprint文が出力される
# @pytest.mark.asyncio
async def test_get_ranking():
        try:
            tmp = await fetch_ranking().get_ranking_from_db_to_list("short")
            print(tmp , "data")
            print("\033[32m" ,f"doc_size: {tmp.__sizeof__()}" + "\033[0m" ) # データの容量を表示
            assert True
        except Exception as e:
            print(f"Error: {e}")
            assert False 