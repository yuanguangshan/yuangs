# data_api_all.py - 最终完整修复版 (纯JSON API)
# 解决了日志冲突、代码重复等所有已知问题，并保留全部代码和常量。

# --- 1. 基础模块导入 ---
import sqlite3
import codecs
import json
import logging
import os
import re
import threading
import time
from datetime import datetime, timedelta
from logging.handlers import RotatingFileHandler
import inspect
from pathlib import Path
from functools import wraps

import akshare as ak
import numpy as np
import pandas as pd
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request, make_response
import xmltodict
from WXBizMsgCrypt import WXBizMsgCrypt
from flask_cors import CORS
from werkzeug.routing import BaseConverter
from pywebpush import webpush, WebPushException
import sqlite3

# --- 从自定义模块导入功能 ---
try:
    from get_ths_data import (
        get_ths_basis,
        get_ths_company_holding,
        get_ths_main_force,
        get_ths_position_ranking,
        get_ths_profit,
        get_ths_stock,
        get_ths_trading,
    )
    from hq import get_exchange_data
except ImportError as e:
    print(
        f"启动错误：无法导入自定义模块。请确保 get_ths_data.py 和 hq.py 文件存在于同一目录。错误: {e}"
    )
    exit(1)

# --- 导入 YouTube Music 服务 ---
try:
    from youtube_service import (
        search_song,
        search_artist,
        get_artist_info,
        get_lyrics,
        get_song_details
    )
    YOUTUBE_SERVICE_AVAILABLE = True
    print("✅ YouTube Music 服务已加载")
except ImportError as e:
    YOUTUBE_SERVICE_AVAILABLE = False
    print(f"⚠️ YouTube Music 服务不可用: {e}")
    # 定义空函数以避免路由报错
    def search_song(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}
    def search_artist(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}
    def get_artist_info(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}
    def get_lyrics(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}
    def get_song_details(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}

# --- 2. 初始化与配置 ---
load_dotenv()

# --- Flask 应用初始化 ---
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
CORS(app)


# --- 日期转换器 ---
class DateConverter(BaseConverter):
    regex = r"\d{4}-\d{2}-\d{2}"

    def to_python(self, value):
        return datetime.strptime(value, "%Y-%m-%d")

    def to_url(self, value):
        return value.strftime("%Y-%m-%d")


app.url_map.converters["date"] = DateConverter

# --- 日志配置 (已修复) ---
log_formatter = logging.Formatter(
    "%(asctime)s - %(levelname)s - %(module)s - %(message)s"
)
log_handler = RotatingFileHandler(
    "data_api.log", maxBytes=1000000, backupCount=3, encoding="utf-8"
)
log_handler.setFormatter(log_formatter)
log_handler.setLevel(logging.INFO)

# [FIXED] 移除Flask默认的handler，避免日志重复输出
from flask.logging import default_handler
app.logger.removeHandler(default_handler)

app.logger.addHandler(log_handler)
app.logger.setLevel(logging.INFO)
# [FIXED] 将werkzeug的日志也导向文件，而不是控制台
logging.getLogger('werkzeug').addHandler(log_handler)
# [FIXED] 移除了冲突的 logging.basicConfig()，这是导致Gunicorn worker崩溃的主要原因
# logging.basicConfig(
#     level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
# )

# --- 3. 核心配置与常量 (已去重) ---

# --- 数据库配置 ---
DB_PATHS = {
    "futures": "futures_data.db",
    "minute": "minute_data.db",
    "qhhq": "qhhq.db",
    "qhlhb": "qhlhb.db",
    "klines": "/home/ubuntu/minute_data.db",
}
LATEST_DATE_FIELDS = {
    "futures": ("hqdata", "日期", "期货代码"),
    "minute": ("minute_klines", "substr(timestamp,1,10)", "code"),
    "qhhq": ("hqdata", "日期", "期货公司"),
    "qhlhb": ("lhb", "日期", "期货公司"),
}

# --- 发布频率限制 ---
TOUTIAO_RATE_LIMIT = {
    "date": datetime.now().strftime("%Y-%m-%d"),
    "count": 0,
    "limit": 45,
}
rate_limit_lock = threading.Lock()

# --- 知乎API相关配置 ---
zhihu_proxy_url = os.getenv("FLASK_PROXY_API_URL")
if zhihu_proxy_url:
    ZHIHU_HOT_API_URL = f"{zhihu_proxy_url}/api/zhihu/hot"
    ZHIHU_INSPIRATION_API_URL = f"{zhihu_proxy_url}/api/zhihu/inspiration"
    logging.info(f"使用代理配置: 知乎热点API = {ZHIHU_HOT_API_URL}")
    logging.info(f"使用代理配置: 知乎灵感API = {ZHIHU_INSPIRATION_API_URL}")
else:
    ZHIHU_HOT_API_URL = "https://newsnow.want.biz/api/s?id=zhihu"
    ZHIHU_INSPIRATION_API_URL = "https://www.zhihu.com/api/v4/creators/recommend/list"
    logging.warning("⚠️ 未配置FLASK_PROXY_API_URL环境变量，将直接调用知乎官方API")

ZHIHU_CONFIG = {
    "hot_api_url": ZHIHU_HOT_API_URL,
    "inspiration_api_url": ZHIHU_INSPIRATION_API_URL,
    "cache_duration": 300,
    "user_agent": "ZhihuHybrid Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
    "headers": {
        "Host": "www.zhihu.com",
        "Cookie": (
            "BEC=1a391e0da683f9b1171c7ee6de8581cb; zst_82=2.0eZIThrz3yhoLAAAASwUAADIuMBvXfWgAAAAAXgGewK5BC1LDt8HYJm1oLPR-YrE=; q_c0=2|1:0|10:1753077525|4:q_c0|92:Mi4xemk4T0FBQUFBQUFBSUJkblVFN3RGZ3NBQUFCZ0FsVk5GV1NsYUFBRjJFSFNVNWRqaUJubi1XTFBYc055T2owY3hR|7f06e47ec86f9f6ded886152c646ebd77b38e781bf61d05e8642ab6a95dc6524; z_c0=2|1:0|10:1753077525|4:z_c0|92:Mi4xemk4T0FBQUFBQUFBSUJkblVFN3RGZ3NBQUFCZ0FsVk5GV1NsYUFBRjJFSFNVNWRqaUJubi1XTFBYc055T2owY3hR|eaf51cb59994605f7a46fda8605543bca6f69118237dd4721e00911fdd76b669; d_c0=ACAXZ1BO7RZLBcPRn4Wd-d-AV-Zh_0TjO7A=|1753077507; ff_supports_webp=1; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1748024974,1749773726,1750009971; _xsrf=OQF5dPbhWz7u3JgNYRUCH5ENI0WqRxxv; edu_user_uuid=edu-v1|55a9641d-29d3-46c2-aba6-5cd6e49f82d4; _zap=9c13540f-053d-4ade-95a0-46817bdd32d5"
        ),
        "Accept": "*/*",
        "x-requested-with": "fetch",
        "Sec-Fetch-Site": "same-origin",
        "x-ms-id": "D28wdOqhFkp+xKhHEicm44T+7X7jw71HgL2zO1NIkbShEX36",
        "x-zse-93": "101_5_3.0",
        "x-hd": "2f1575458c8a4be82627fba342568473",
        "x-zst-82": "2.0eZIThrz3yhoLAAAASwUAADIuMBvXfWgAAAAAXgGewK5BC1LDt8HYJm1oLPR-YrE=",
        "Sec-Fetch-Mode": "cors",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent": (
            "ZhihuHybrid osee2unifiedRelease/24008 osee2unifiedReleaseVersion/10.60.0 Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        ),
        "Referer": "https://www.zhihu.com/appview/creator",
        "x-app-version": "10.60.0",
        "Connection": "keep-alive",
        "x-ac-udid": "ACAXZ1BO7RZLBcPRn4Wd-d-AV-Zh_0TjO7A=",
        "Sec-Fetch-Dest": "empty",
        "x-zse-96": "2.0_MB7Iyz2YCpM9aaWVkNnV2qpImCnZJjc1QtYokgTco0=faYPkJK=yLRzCSs=mlYYM",
    },
}

ZHIHU_CACHE = {
    "hot_topics": {"timestamp": 0, "data": None},
    "inspiration_questions": {"timestamp": 0, "data": None},
}

# --- 头条API相关常量 ---
FLASK_PROXY_API_URL = os.getenv("FLASK_PROXY_API_URL")
TOUTIAO_API_BASE_URL = (
    FLASK_PROXY_API_URL or "https://ib.snssdk.com/pgcapp/mp/agw/article/publish"
)
if not FLASK_PROXY_API_URL:
    logging.warning("⚠️ 未配置 FLASK_PROXY_API_URL 环境变量，将直接调用头条官方API")

TOUTIAO_QUERY_PARAMS = {
    "session_id": "4A3CCF1E-0A90-4FF5-9D7F-2C43038A2311",
    "version_code": "9.0.0",
    "tma_jssdk_version": "2.53.2.0",
    "app_name": "news_article_social",
    "app_version": "9.0.0",
    "carrier_region": "CN",
    "device_id": "3591453919949805",
    "channel": "App Store",
    "resolution": "1170*2532",
    "aid": "19",
    "ab_version": "1859936,668776,13356769,668779,13356755,662099,12636413,13293553,12305809,13126479,13215653,13373095,4113875,4522574,4890008,6571799,7204589,7354844,7551466,8160328,8553218,8639938,8885971,8985781,9671606,10146301,10251872,10386924,10433952,10645729,10703934,10743278,10772964,10797943,10849833,10879886,11144711,11232912,11239382,11308092,11394631,11513698,11563236,11565349,11645964,11649962,11661813,11709192,11763389,11786812,11796248,11823590,11823748,11823877,11839761,11906663,11920653,11924697,11970513,11970596,11970655,11981315,12126055,12172770,12327156,12363458,12368504,12378301,12384208,12389444,12403709,12496899,12523247,12589695,12690790,12720695,12733027,12785735,12836704,12860549,12888549,12937660,12952090,12984593,12984891,12985928,12988354,12990051,12990119,13027015,13042650,13063492,13072413,13098989,13107216,13115718,13135331,13143696,13148461,13154507,13164816,13201836,13222263,13227575,13264130,13265056,13269343,13272746,13277739,13286697,13293838,13294457,13295710,13299207,13300136,13302896,13308931,13316011,13319569,13329548,13343756,13344454,13345087,13349421,13350564,13353112,13353880,13357778,13359423,13363700,13364742,13365092,13367499,13367883,13369098,13369251,13371369,13372334,13372445,13375116,13375511,13375820,13379882,13381650,13381940,13382234,13223470,10282085,668775,9328991,9629719,11295211,12945760,13356744,668774,13149414,13356742,662176,13356741,660830,13356743,10549444,13162708,13377132,11254714,9470952,9855884,11622653,12110965,12593783,12779906,12901058,12940566,13174430,13235472,13257457,13283710,13293852,13297076,13331007,13331919,13366931,13374303,13375428,13166144,7142413,8504306,10511023,10756958,12467959,13183282,13214397,13037701,10357230,13095523,13190769,13303652,13333297,13346524",
    "ab_feature": "4783616,794528,1662481,3408339,4743952",
    "ab_group": "4783616,794528,1662481,3408339,4743952",
    "update_version_code": "90020",
    "cdid": "007B8099-C811-4864-A7E3-DBCD3D4BC79C",
    "ac": "WIFI",
    "os_version": "18.5",
    "ssmix": "a",
    "device_platform": "iphone",
    "iid": "3186833641732558",
    "device_type": "iPhone 14",
    "ab_client": "a1,f2,f7,e1",
}

TOUTIAO_HEADERS = {
    "Host": "ib.snssdk.com",
    "Connection": "keep-alive",
    "x-Tt-Token": "00beea9a49b13130a18ffaf8397042fab700c003fd996720690ed1322b340d464536b4ca2a2aa0868cb61df177c4081ae4dae80785b0ec888969220aeb60ba60d99df6369362fd70e8d89cfb7c46e2713d09a32d3b638da6c8133ad2885e112c65289--0a490a20523ccfab387acfed3f5d8e43be1d7642dcefff4445b6d88158b33d211636133812208f3963668516980676fc24d91bf26cb75d3b1078c6a2d195624a071c695bbe6c18f6b4d309-3.0.1",
    "Cookie": "store-region=cn-sh; store-region-src=uid; FRM=new; PIXIEL_RATIO=3; WIN_WH=390_844; d_ticket=03baf8528d2ed41d6e4f50bbab6d510e9c684; ttwid=1%7CCuG9RHWdsNGnIkwQzxaGQYNdFB7oKQXJlzowyBPnavQ%7C1699378517%7C8c0c38a62793b9bbe3a33a8930d5ac059278fc7e681b53a1f3e94d0d59bec043; odin_tt=e664859603dd14a3b61beb10a5b56949a14e9856d1da68788f5988c36a26b177919315c204f455c8a8371cd56af40a1cfb957d87605b52d03246eacfacb3912c; ariaDefaultTheme=undefined; passport_csrf_token=fc5cb2b50e13c6525d1895832aa2113c; passport_csrf_token_default=fc5cb2b50e13c6525d1895832aa2113c; is_staff_user=false; sessionid=beea9a49b13130a18ffaf8397042fab7; sessionid_ss=beea9a49b13130a18ffaf8397042fab7; sid_guard=beea9a49b13130a18ffaf8397042fab7%7C1751570868%7C5184000%7CMon%2C+01-Sep-2025+19%3A27%3A48+GMT; sid_tt=beea9a49b13130a18ffaf8397042fab7; sid_ucp_v1=1.0.0-KGI3Mjk2ZTBkMTMxMmE5MmJiODRiOTRmYWY1ODFmNTJiYTA5Njc5NTEKJgjx7u3MFRC0s5vDBhgTIAwol9nwvr3M2AQw2p2XswU4AkDxB0gBGgJsZiIgYmVlYTlhNDliMTMxMzBhMThmZmFmODM5NzA0MmZhYjc; ssid_ucp_v1=1.0.0-KGI3Mjk2ZTBkMTMxMmE5MmJiODRiOTRmYWY1ODFmNTJiYTA5Njc5NTEKJgjx7u3MFRC0s5vDBhgTIAwol9nwvr3M2AQw2p2XswU4AkDxB0gBGgJsZiIgYmVlYTlhNDliMTMxMzBhMThmZmFmODM5NzA0MmZhYjc; uid_tt=a6f1b830a6aad57983224b2b49766a3d; uid_tt_ss=a6f1b830a6aad57983224b2b49766a3d; passport_csrf_token=fc5cb2b50e13c6525d1895832aa2113c; passport_csrf_token_default=fc5cb2b50e13c6525d1895832aa2113c; ariaDefaultTheme=undefined; odin_tt=e664859603dd14a3b61beb10a5b56949a14e9856d1da68788f5988c36a26b177919315c204f455c8a8371cd56af40a1cfb957d87605b52d03246eacfacb3912c; ttwid=1%7CCuG9RHWdsNGnIkwQzxaGQYNdFB7oKQXJlzowyBPnavQ%7C1699378517%7C8c0c38a62793b9bbe3a33a8930d5ac059278fc7e681b53a1f3e94d0d59bec043; d_ticket=03baf8528d2ed41d6e4f50bbab6d510e9c684; FRM=new; PIXIEL_RATIO=3; WIN_WH=390_844; store-region=cn-sh; store-region-src=uid",
    "tt-request-time": "1752642339124",
    "User-Agent": "NewsSocial 9.0.0 rv:9.0.0.20 (iPhone; iOS 18.5; zh_CN) Cronet",
    "sdk-version": "2",
    "x-tt-dt": "AAAZGUYOABV34XKPYQAACEOO4MBQWN2OA7IRSYSOASZQA4DBZRY7CYANGO53CNAD5EETHYYWFCH6SN3LDPBSJOZCDU536OHV5HR2EG6QGTAGOQA5CMGBENT3B3B3U7AYTV3CDGGNQY7CFRRZBW65FM4XQ",
    "passport-sdk-version": "5.17.5-rc.8-toutiao",
    "X-SS-STUB": "E94C602985537DACD686BFB04ED20198",
    "x-tt-local-region": "unknown",
    "x-bd-kmsv": "1",
    "x-tt-trace-id": "00-119fc2d00dcc268872033edc3b620013-119fc2d00dcc2688-01",
    "Accept-Encoding": "gzip, deflate",
    "X-Argus": "FEBoYI7BSzvTZRbQ9ibi2xCGbmguVmyMLkpCrKA89hk+YgQqws/TvqucNvoAWBnCBdSTDV6jv+LjzxHbnF/D9xOH5mU4hnpm9uL1H/ucCvND6WIke5OL4Hpou3RcA33fd5p+mHMLiL3HEu283Q9vSsW1YCJxBYUqd02Aj5wvEngZgWzabNjguFbpNg+AZ1R79wfr5phkaHQusi3YlDCXt1gaskaaTOIV70DcEfl7HbGwRpZH5k9FE2h3GBYohM2QHjyyNeEpWcL3USw0nuv771XuDmfCP/ubVJKXl+GJ1XUQGuCFTl1c3TftWEatoicHYOA=",
    "X-Gorgon": "8404e0230000fbbd0c9203ec8975280bb5a16f348e48f929a7eb",
    "X-Khronos": "1752642339",
    "X-Ladon": "8T7vOGRNi4tIZIfnnUxbxGZeJysrb+Z2DzGVwqbyM3f+8XOM",
}

TOUTIAO_POST_DATA_TEMPLATE = {
    "article_ad_type": "3",
    "article_type": "0",
    "claim_origin": "0",
    "from_page": "main_publisher",
    "goods_card_cnt": "0",
    "is_original_image_clicked": "0",
    "paste_words_cnt": "0",
    "pgc_feed_covers": "[]",
    "pgc_id": "7527541462024585754",
    "praise": "0",
    "save": "1",
    "source": "3",
    "with_video": "0",
}

# --- 博客发布 API 相关配置 ---
BLOG_POST_CONFIG = {
    "url": "https://blog.want.biz/new",
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
        "cache-control": "no-cache",
        "origin": "https://blog.want.biz",
        "pragma": "no-cache",
        "referer": "https://blog.want.biz/new",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    },
}

# --- Web Push 推送服务配置 ---
VAPID_PRIVATE_KEY = os.environ.get("VAPID_PRIVATE_KEY")
VAPID_PUBLIC_KEY = os.environ.get("VAPID_PUBLIC_KEY")
VAPID_CLAIMS = {
    "sub": f"mailto:{os.environ.get('VAPID_CONTACT_EMAIL', 'yuanguangshan@gmail.com')}"
}
PUSH_API_KEY = os.environ.get("PUSH_API_KEY", "0503")

# --- 期货相关常量 ---
COMPANIES = [
    "国泰君安期货", "银河期货", "中信期货", "永安期货", "华泰期货", "东证期货", "中信建投期货",
    "中泰期货", "浙商期货", "光大期货", "南华期货", "中粮期货", "国投安信期货", "招商期货",
    "广发期货", "新湖期货", "方正中期期货", "申银万国期货", "宏源期货", "海通期货", "瑞达期货",
    "五矿期货", "平安期货", "东吴期货", "国信期货", "国元期货", "建信期货", "兴证期货",
    "弘业期货", "广州期货", "创元期货", "长江期货", "金瑞期货", "徽商期货", "兴业期货",
    "中金财富期货", "国贸期货", "东海期货", "国联期货", "宝城期货", "信达期货", "国海良时",
    "格林大华", "东方财富期货", "华安期货", "海证期货", "紫金天风", "一德期货", "中金期货",
    "华西期货", "物产中大期货", "华融融达期货", "中国国际期货", "华闻期货", "国富期货",
]
VARIETIES = [
    "PR", "M", "RB", "TA", "MA", "RM", "P", "V", "RU", "Y", "FG", "PP", "EB", "I", "FU",
    "AG", "C", "HC", "SP", "SA", "L", "SI", "NI", "EG", "CF", "IM", "OI", "CU", "SR",
    "AL", "IC", "SS", "IF", "PX", "AU", "B", "LC", "PF", "PG", "NR", "JD", "SF", "CS",
    "UR", "JM", "SN", "BU", "IH", "T", "A", "LU", "ZN", "AP", "PK", "SM", "TF", "LH",
    "AO", "PB", "TS", "TL", "J", "CJ", "EC", "SH", "CY", "BC",
]
CODE_MAP = {
    "PR": "瓶片", "M": "豆粕", "Y": "豆油", "C": "玉米", "RM": "菜粕", "I": "铁矿石",
    "MA": "甲醇", "HC": "热卷", "SA": "纯碱", "P": "棕榈油", "AG": "沪银", "RB": "螺纹钢",
    "LC": "碳酸锂", "SI": "工业硅", "IF": "沪深300", "IC": "中证500", "OI": "菜油",
    "L": "塑料", "IM": "中证1000", "T": "十年国债", "RU": "橡胶", "JM": "焦煤", "SF": "硅铁",
    "IH": "上证50", "ZN": "沪锌", "V": "PVC", "SM": "锰硅", "BU": "沥青", "NR": "20号胶",
    "AL": "沪铝", "LH": "生猪", "SP": "纸浆", "CS": "玉米淀粉", "NI": "沪镍", "SS": "不锈钢",
    "SN": "沪锡", "AP": "苹果", "TL": "三十年国债", "B": "豆二", "CJ": "红枣", "SH": "烧碱",
    "A": "豆一", "TS": "二年国债", "PF": "短纤", "AU": "沪金", "EC": "欧线集运",
    "AO": "氧化铝", "PG": "LPG", "PB": "沪铅", "FU": "燃油", "CU": "沪铜", "PK": "花生",
    "TF": "五年国债", "PP": "聚丙烯", "BC": "国际铜", "PX": "对二甲苯", "CY": "棉纱",
    "TA": "PTA", "CF": "棉花", "SR": "白糖", "FG": "玻璃", "JD": "鸡蛋", "RS": "菜籽",
    "LU": "低硫燃油", "UR": "尿素", "EG": "乙二醇", "J": "焦炭",
}


# --- 4. 辅助函数 (已去重和优化) ---

# --- Helper Function for JSBox DB Connection ---
def get_jsbox_db_conn():
    # 建议为JSBox启动器使用一个独立的数据库文件
    conn = sqlite3.connect('jsbox_launchers.db', timeout=10)
    conn.row_factory = sqlite3.Row  # 以字典形式返回行
    return conn

def log_execution_time(func):
    """一个装饰器，用于记录函数执行时间。"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        app.logger.info(f"开始执行: {func.__name__}")
        try:
            result = func(*args, **kwargs)
            end_time = time.time()
            duration = end_time - start_time
            app.logger.info(f"完成执行: {func.__name__}，耗时: {duration:.2f}秒")
            return result
        except Exception as e:
            end_time = time.time()
            duration = end_time - start_time
            app.logger.error(f"执行失败: {func.__name__}，耗时: {duration:.2f}秒，错误: {e}", exc_info=True)
            raise
    return wrapper

def safe_json_serializer(obj):
    """统一的JSON序列化器，处理日期、Numpy和Pandas特殊类型"""
    if pd.isna(obj) or obj == "undefined" or obj == "NaN":
        return None
    elif isinstance(obj, (np.integer, int)):
        return int(obj)
    elif isinstance(obj, (np.floating, float)):
        return float(obj) if not np.isnan(obj) else None
    elif isinstance(obj, (pd.Timestamp, pd.Period, datetime)):
        return obj.isoformat()
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return str(obj)

def dataframe_to_json_response(df):
    """将DataFrame转换为统一的Flask JSON响应：{"data": [...]}"""
    if not isinstance(df, pd.DataFrame):
        app.logger.error(f"dataframe_to_json_response 收到非DataFrame类型: {type(df)}")
        return jsonify({"error": "内部服务器错误：预期数据类型为DataFrame"}), 500
    df = df.replace({np.nan: None})
    data = df.to_dict(orient='records')
    # 使用自定义序列化器以防万一，尽管jsonify已经很强大
    json_string = json.dumps({"data": data}, ensure_ascii=False, default=safe_json_serializer)
    return app.response_class(response=json_string, status=200, mimetype='application/json')

CURL_FILE = Path("/home/ubuntu/zhihu_cookie_for_data_api.txt")

def load_curl_command(path: Path):
    if not path.exists():
        import sys
        print(f"Error: 未找到 curl 文件 {path}", file=sys.stderr)
        sys.exit(1)
    content = path.read_text(encoding="utf-8")
    return content.replace("\n", " ").strip()

def parse_headers_from_curl(curl_cmd: str) -> dict:
    headers = {}
    pattern = re.compile(r"-H\s+['\"]([^:'\" ]+):\s*([^'\"]*)['\"]")
    for key, val in pattern.findall(curl_cmd):
        headers[key] = val
    return headers

def update_zhihu_headers():
    if CURL_FILE.exists():
        curl_cmd = load_curl_command(CURL_FILE)
        new_h = parse_headers_from_curl(curl_cmd)
        ZHIHU_CONFIG["headers"].update(new_h)
        app.logger.info("已更新知乎请求参数。")
    else:
        app.logger.warning(f"未找到知乎cookie文件: {CURL_FILE}")

def fetch_zhihu_hot_topics():
    now = time.time()
    if (
        ZHIHU_CACHE["hot_topics"]["data"]
        and now - ZHIHU_CACHE["hot_topics"]["timestamp"]
        < ZHIHU_CONFIG["cache_duration"]
    ):
        return ZHIHU_CACHE["hot_topics"]["data"]
    try:
        response = requests.get(
            ZHIHU_CONFIG["hot_api_url"],
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        if not data or not data.get("items"):
            raise Exception("知乎热点API返回数据格式异常")
        topics = process_zhihu_data(data["items"])
        ZHIHU_CACHE["hot_topics"] = {"timestamp": now, "data": topics}
        return topics
    except Exception as e:
        logging.error(f"获取知乎热点失败: {str(e)}")
        return get_fallback_topics()

def fetch_zhihu_inspiration_questions(page_size=100, current=1):
    now = time.time()
    if (
        ZHIHU_CACHE["inspiration_questions"]["data"]
        and now - ZHIHU_CACHE["inspiration_questions"]["timestamp"]
        < ZHIHU_CONFIG["cache_duration"]
    ):
        return ZHIHU_CACHE["inspiration_questions"]["data"]
    try:
        response = requests.get(
            f"{ZHIHU_CONFIG['inspiration_api_url']}?pageSize={page_size}&current={current}",
            headers=ZHIHU_CONFIG["headers"],
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        if not data or not data.get("question_data"):
            raise Exception("知乎灵感问题API返回数据格式异常")
        questions = process_inspiration_data(data["question_data"])
        ZHIHU_CACHE["inspiration_questions"] = {"timestamp": now, "data": questions}
        return questions
    except Exception as e:
        logging.error(f"获取知乎灵感问题失败: {str(e)}")
        return get_fallback_inspiration_questions()

def process_zhihu_data(raw_data):
    if not isinstance(raw_data, list):
        return []
    processed_data = []
    for item in raw_data:
        processed_item = {
            "id": item.get("id") or str(time.time()),
            "title": item.get("title") or item.get("question") or "无标题",
            "url": item.get("url") or item.get("link") or "#",
            "hot": (item.get("extra", {}) and item.get("extra", {}).get("hot"))
            or item.get("hot")
            or item.get("hot_value")
            or item.get("score")
            or "0",
            "excerpt": item.get("excerpt") or item.get("desc") or "",
            "answers": item.get("answers") or item.get("answer_count") or 0,
            "category": "知乎热点",
            "timestamp": datetime.now().isoformat(),
            "type": "hot",
        }
        processed_data.append(processed_item)
    return processed_data

def process_inspiration_data(raw_data):
    if not isinstance(raw_data, list):
        return []
    processed_data = []
    for item in raw_data:
        tags = extract_tags_from_question(item)
        processed_item = {
            "id": item.get("id") or str(time.time()),
            "title": item.get("title") or "无标题",
            "url": f"https://www.zhihu.com/question/{item.get('token') or item.get('id')}"
            or "#",
            "hot": item.get("follower_count") or 0,
            "excerpt": item.get("excerpt") or "",
            "answer_count": item.get("answer_count") or 0,
            "category": "知乎灵感问题",
            "timestamp": datetime.now().isoformat(),
            "type": "inspiration",
            "tags": tags,
        }
        processed_data.append(processed_item)
    return processed_data

def extract_tags_from_question(question):
    tags = []
    if question.get("title"):
        title_words = re.split(r"[,，、\s]", question["title"])
        tags.extend([word for word in title_words if 2 <= len(word) <= 6][:3])
    if len(tags) < 3:
        tags.extend(
            [
                tag
                for tag in ["灵感", "问题", "知乎", "创作", "讨论"]
                if tag not in tags and len(tags) < 5
            ]
        )
    return tags

def get_fallback_topics():
    return [
        {
            "id": "fallback1",
            "title": "2025年AI将如何改变我们的工作方式？",
            "url": "https://www.zhihu.com/question/ai2025",
            "hot": "2000万",
            "excerpt": "随着ChatGPT、Claude等AI工具的普及...",
            "answers": 158,
            "category": "知乎热点",
            "timestamp": datetime.now().isoformat(),
            "type": "hot",
        }
    ]

def get_fallback_inspiration_questions():
    return [
        {
            "id": "ins_fallback1",
            "title": "作为一个普通人，如何在日常生活中培养创造力？",
            "url": "https://www.zhihu.com/question/creativity_daily",
            "hot": "1200万",
            "excerpt": "创造力不仅仅属于艺术家和科学家...",
            "answer_count": 156,
            "category": "知乎灵感问题",
            "timestamp": datetime.now().isoformat(),
            "type": "inspiration",
            "tags": ["创造力", "自我提升", "思维", "习惯养成"],
        }
    ]

def check_and_update_toutiao_limit():
    with rate_limit_lock:
        today_str = datetime.now().strftime("%Y-%m-%d")
        if TOUTIAO_RATE_LIMIT["date"] != today_str:
            TOUTIAO_RATE_LIMIT["date"] = today_str
            TOUTIAO_RATE_LIMIT["count"] = 0
            logging.info("新的一天，重置头条发布计数器。")
        if TOUTIAO_RATE_LIMIT["count"] >= TOUTIAO_RATE_LIMIT["limit"]:
            logging.warning(
                f"今日头条发布次数已达上限 ({TOUTIAO_RATE_LIMIT['limit']})，将跳过发布。"
            )
            return False
        TOUTIAO_RATE_LIMIT["count"] += 1
        logging.info(
            f"头条发布计数增加，今日已尝试发布 {TOUTIAO_RATE_LIMIT['count']} 次。"
        )
        return True

def _post_to_toutiao(title, content):
    try:
        post_data_payload = TOUTIAO_POST_DATA_TEMPLATE.copy()
        post_data_payload.update(
            {
                "title": title,
                "content": content,
                "extra": json.dumps({"content_word_cnt": len(content)}),
            }
        )
        if "pgc_id" in post_data_payload:
            del post_data_payload["pgc_id"]
        toutiao_response = requests.post(
            TOUTIAO_API_BASE_URL,
            params=TOUTIAO_QUERY_PARAMS,
            data=post_data_payload,
            headers=TOUTIAO_HEADERS,
            timeout=15,
            verify=False,
        )
        response_json = (
            toutiao_response.json()
            if "application/json" in toutiao_response.headers.get("Content-Type", "")
            else {
                "error": "Toutiao API returned non-JSON response",
                "raw_response": toutiao_response.text[:500],
            }
        )
        toutiao_response.raise_for_status()
        return {"status": "success", "response": response_json}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": f"头条API请求失败: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"头条发布时发生未知错误: {str(e)}"}

def _post_to_blog(title, content_md, tags):
    try:
        client_id = os.getenv("CF_CLIENT_ID")
        client_secret = os.getenv("CF_CLIENT_SECRET")
        if not all([client_id, client_secret]):
            raise ValueError("环境变量 CF_CLIENT_ID 或 CF_CLIENT_SECRET 未设置。")

        request_headers = BLOG_POST_CONFIG["headers"].copy()
        request_headers["CF-Access-Client-Id"] = client_id
        request_headers["CF-Access-Client-Secret"] = client_secret

        form_data = {
            "title": (None, title),
            "content": (None, content_md),
            "tags": (None, tags),
            "image": ("", b"", "application/octet-stream"),
        }
        blog_response = requests.post(
            BLOG_POST_CONFIG["url"],
            headers=request_headers,
            files=form_data,
            timeout=20,
            verify=False,
            allow_redirects=False,
        )
        if (
            blog_response.status_code == 302 or blog_response.status_code == 303
        ) and "Location" in blog_response.headers:
            redirect_url = blog_response.headers["Location"]
            if "cloudflareaccess.com" in redirect_url and (
                "login" in redirect_url or "access" in redirect_url
            ):
                logging.info(
                    f"博客发布成功，但被重定向到 Cloudflare Access URL: {redirect_url}"
                )
                return {
                    "status": "success",
                    "message": "博客发布成功！(通过 Cloudflare Access 重定向)",
                    "redirect_url": redirect_url,
                }
            return {
                "status": "success",
                "message": "博客发布成功！",
                "redirect_url": redirect_url,
            }
        else:
            return {
                "status": "error",
                "message": f"博客发布失败，状态码: {blog_response.status_code}",
                "details": blog_response.text[:500],
            }
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": f"请求博客系统时发生网络错误: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"博客发布时发生未知错误: {str(e)}"}

def _execute_publishing_flow(title, content_plain, content_md, tags, targets=None):
    if targets is None:
        targets = ["toutiao","blog"]

    results = {}

    if "toutiao" in targets:
        can_post_to_toutiao = check_and_update_toutiao_limit()
        if can_post_to_toutiao:
            logging.info(f"执行头条发布: '{title}'")
            results["toutiao"] = _post_to_toutiao(title, content_plain)
        else:
            results["toutiao"] = {
                "status": "skipped",
                "message": "今日发布次数已达上限。",
            }

    if "blog" in targets:
        logging.info(f"执行博客发布: '{title}'")
        results["blog"] = _post_to_blog(title, content_md, tags)

    return results

def get_cloudflare_data():
    try:
        response = requests.get("https://pytest.want.biz")
        if response.status_code == 200:
            return response.json(), None
        else:
            return None, f"API请求失败，状态码：{response.status_code}"
    except Exception as e:
        return None, str(e)

def jsl_etf_data():
    url = "https://www.jisilu.cn/data/etf/etf_list/"
    app.logger.info("开始从集思录获取ETF数据...")
    start_time = time.time()
    response = requests.get(url, timeout=15)
    duration = time.time() - start_time
    app.logger.info(f"从集思录获取ETF数据完成，耗时: {duration:.2f}秒")
    
    response.raise_for_status()
    data = response.json()
    df = pd.DataFrame(data["rows"])
    df = df["cell"].apply(pd.Series)
    df = df.dropna(subset=["unit_total", "unit_incr"])
    df["unit_total"] = df["unit_total"].astype(float)
    df["unit_incr"] = df["unit_incr"].astype(float)
    df["规模变化率_raw"] = np.where(df['unit_total'] > 0, df['unit_incr'] / df['unit_total'], 0)
    df["规模变化率"] = df["规模变化率_raw"].apply(lambda x: f"{x * 100:.2f}%")
    df_filtered = df[df["unit_total"] > 100]
    df_sorted = df_filtered.sort_values(by="规模变化率_raw", ascending=False)
    df_final = df_sorted[
        ["index_nm", "fund_id", "increase_rt", "unit_total", "unit_incr", "规模变化率"]
    ].head(20)
    df_final.columns = ["名称", "代码", "涨幅", "总规模", "规模变化", "规模变化率"]
    return df_final.to_dict(orient="records")

def code_prefix(code: str) -> str:
    match = re.match(r"([a-zA-Z]+)", code)
    return match.group(1).upper() if match else ""

def build_latest_sql(db_type, table, date_col, code_col, prefix, limit=100):
    pattern = f"{prefix}%"
    sql = f"""SELECT * FROM {table} WHERE `{code_col}` LIKE ? AND {date_col} = (SELECT MAX({date_col}) FROM {table} WHERE `{code_col}` LIKE ?) LIMIT ?"""
    params = (pattern, pattern, limit)
    return sql, params

def gbk_row_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        value = row[idx]
        if isinstance(value, bytes):
            try:
                d[col[0]] = codecs.decode(value, "gbk")
            except UnicodeDecodeError:
                d[col[0]] = value
        else:
            d[col[0]] = value
    return d

# --- 推送服务辅助函数 ---
def verify_push_api_key(auth_header):
    """验证推送API密钥"""
    if not auth_header or not auth_header.startswith('Bearer '):
        return False
    return auth_header[7:] == PUSH_API_KEY

def send_web_push(subscription, payload, ttl=86400):
    """发送Web推送通知"""
    try:
        response = webpush(
            subscription_info=subscription,
            data=json.dumps(payload),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS,
            ttl=ttl
        )
        return {"success": True, "status_code": response.status_code}
    except WebPushException as e:
        status_code = e.response.status_code if hasattr(e, 'response') and e.response else 500
        return {"success": False, "error": str(e), "status_code": status_code}
    except Exception as e:
        return {"success": False, "error": str(e), "status_code": 500}


# =====================================================================
# --- 5. API 路由定义 (已去重和修正) ---
# =====================================================================

# API 1: 获取所有启动器 (替代 LeanCloud 的 Items 表查询)
@app.route("/api/jsbox/launchers", methods=["GET"])
@log_execution_time
def get_all_launchers():
    conn = get_jsbox_db_conn()
    try:
        # order by updated_at desc 模仿了原脚本的排序逻辑
        launchers = conn.execute("SELECT * FROM launchers ORDER BY updated_at DESC").fetchall()
        # 将结果转换为字典列表
        result = [dict(row) for row in launchers]
        # 为了与 LeanCloud 的返回格式兼容，包裹在 'results' 键下
        return jsonify({"results": result})
    except Exception as e:
        app.logger.error(f"获取所有启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库查询失败"}), 500
    finally:
        conn.close()

# API 2: 获取"我的上传" (根据 device_token 查询)
@app.route("/api/jsbox/my_launchers", methods=["GET"])
@log_execution_time
def get_my_launchers():
    device_token = request.args.get('device_token')
    if not device_token:
        return jsonify({"error": "缺少 device_token 参数"}), 400
    
    conn = get_jsbox_db_conn()
    try:
        launchers = conn.execute(
            "SELECT * FROM launchers WHERE device_token = ? ORDER BY updated_at DESC",
            (device_token,)
        ).fetchall()
        result = [dict(row) for row in launchers]
        return jsonify({"results": result})
    except Exception as e:
        app.logger.error(f"获取我的启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库查询失败"}), 500
    finally:
        conn.close()

# API 3: 上传一个新的启动器
@app.route("/api/jsbox/launchers", methods=["POST"])
@log_execution_time
def create_launcher():
    data = request.get_json()
    app.logger.info(f"create_launcher 收到: {data}")  # 添加日志
    if not data or not all(k in data for k in ['title', 'url_scheme', 'icon_url', 'device_token']):
        app.logger.warning(f"缺少必要字段，收到的数据: {data}")
        return jsonify({"error": "缺少必要字段"}), 400

    conn = get_jsbox_db_conn()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO launchers (title, url_scheme, icon_url, description, device_token)
            VALUES (?, ?, ?, ?, ?)
            """,
            (data['title'], data['url_scheme'], data['icon_url'], data.get('description'), data['device_token'])
        )
        conn.commit()
        # 返回一个与 LeanCloud 相似的成功响应
        return jsonify({"objectId": cursor.lastrowid, "createdAt": datetime.now().isoformat()}), 201
    except sqlite3.IntegrityError as e:
        # 检查是否是URL Scheme冲突
        if "url_scheme" in str(e).lower() or "unique" in str(e).lower():
            return jsonify({"error": "该 URL Scheme 已存在"}), 409
        else:
            app.logger.error(f"创建启动器时违反完整性约束: {e}")
            return jsonify({"error": "数据违反完整性约束"}), 409
    except Exception as e:
        app.logger.error(f"创建启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库插入失败"}), 500
    finally:
        conn.close()

# API 4: 更新一个启动器 (根据 ID)
@app.route("/api/jsbox/launchers/<int:launcher_id>", methods=["PUT"])
@log_execution_time
def update_launcher(launcher_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "缺少必要字段"}), 400

    conn = get_jsbox_db_conn()
    try:
        cursor = conn.cursor()
        
        # 首先获取当前记录的信息
        current_record = cursor.execute(
            "SELECT title, url_scheme, icon_url, description FROM launchers WHERE id = ?", 
            (launcher_id,)
        ).fetchone()
        
        if not current_record:
            return jsonify({"error": "未找到指定的启动器"}), 404
        
        # 获取新值，如果未提供则使用当前值
        new_title = data.get('title', current_record['title'])
        new_url_scheme = data.get('url_scheme', current_record['url_scheme'])
        new_icon_url = data.get('icon_url', current_record['icon_url'])
        new_description = data.get('description', current_record['description'])
        
        # 检查是否要更新URL Scheme
        current_url_scheme = current_record['url_scheme']
        
        # 如果URL Scheme没有改变，直接更新其他字段
        if new_url_scheme == current_url_scheme:
            cursor.execute(
                """
                UPDATE launchers 
                SET title=?, url_scheme=?, icon_url=?, description=?
                WHERE id=?
                """,
                (new_title, new_url_scheme, new_icon_url, new_description, launcher_id)
            )
        else:
            # 如果URL Scheme改变了，先检查是否与其他记录冲突
            conflict_check = cursor.execute(
                "SELECT id FROM launchers WHERE url_scheme = ? AND id != ?",
                (new_url_scheme, launcher_id)
            ).fetchone()
            
            if conflict_check:
                return jsonify({"error": "该 URL Scheme 已存在"}), 409
                
            # 没有冲突，执行更新
            cursor.execute(
                """
                UPDATE launchers 
                SET title=?, url_scheme=?, icon_url=?, description=?
                WHERE id=?
                """,
                (new_title, new_url_scheme, new_icon_url, new_description, launcher_id)
            )
        
        conn.commit()
        return jsonify({"message": "更新成功"})
    except sqlite3.IntegrityError as e:
        # 捕获可能的其他完整性错误
        app.logger.error(f"更新启动器时违反完整性约束: {e}")
        return jsonify({"error": "数据违反完整性约束"}), 409
    except Exception as e:
        app.logger.error(f"更新启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库更新失败"}), 500
    finally:
        conn.close()

# API 5: 删除一个启动器 (根据 ID)
@app.route("/api/jsbox/launchers/<int:launcher_id>", methods=["DELETE"])
@log_execution_time
def delete_launcher(launcher_id):
    conn = get_jsbox_db_conn()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM launchers WHERE id = ?", (launcher_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "未找到指定的启动器"}), 404
            
        return jsonify({}), 200  # LeanCloud 删除成功返回空对象和200
    except Exception as e:
        app.logger.error(f"删除启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库删除失败"}), 500
    finally:
        conn.close()

@app.route("/health")
def health():
    """健康检查接口"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route("/api/<db_type>", methods=["GET"])
def api_latest_one_day(db_type):
    if db_type not in DB_PATHS:
        return jsonify({"error": f"无效的数据类型: {db_type}"}), 400
    code = request.args.get("code", "").strip()
    if not code:
        return jsonify({"error": "code 参数必须提供"}), 400
    try:
        limit = int(request.args.get("limit", 100))
    except ValueError:
        return jsonify({"error": "limit 参数必须是整数"}), 400
    db_path = DB_PATHS[db_type]
    table, date_col, code_col = LATEST_DATE_FIELDS[db_type]
    prefix = code_prefix(code)
    sql, params = build_latest_sql(db_type, table, date_col, code_col, prefix, limit)
    conn = None
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = gbk_row_factory
        cur = conn.cursor()
        cur.execute(sql, params)
        rows = cur.fetchall()
        columns = [description[0] for description in cur.description]
        meta = {
            "query_type": "latest_day",
            "instrument_pattern": f"{prefix}%",
            "limit": limit,
            "count": len(rows),
            "sql": sql.strip(),
        }
        body = {"meta": meta, "columns": columns, "data": rows}
        return jsonify(body)
    except Exception as e:
        return jsonify({"error": f"数据库查询失败: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route("/api/aggregate", methods=["GET"])
def api_aggregate():
    code = request.args.get("code", "").strip().upper()
    if not code:
        return jsonify({"error": "code 参数必须提供"}), 400
    allowed_agg_funcs = ["MAX", "MIN", "AVG", "SUM"]
    agg_func = request.args.get("agg_func", "MAX").upper()
    if agg_func not in allowed_agg_funcs:
        return jsonify(
            {"error": f"不支持的聚合函数: {agg_func}. 可选: {allowed_agg_funcs}"}
        ), 400
    allowed_agg_cols = ["开盘", "最高", "最低", "收盘", "成交量", "成交额"]
    agg_col = request.args.get("agg_col")
    if not agg_col or agg_col not in allowed_agg_cols:
        return jsonify(
            {"error": f"必须提供且有效的聚合字段 (agg_col)，可选: {allowed_agg_cols}"}
        ), 400
    try:
        days = int(request.args.get("days", 10))
    except ValueError:
        return jsonify({"error": "days 参数必须是整数"}), 400
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    end_date_str = end_date.strftime("%Y-%m-%d")
    start_date_str = start_date.strftime("%Y-%m-%d")
    db_path = DB_PATHS["futures"]
    table_name, date_col, code_col = LATEST_DATE_FIELDS["futures"]
    prefix = code_prefix(code)
    pattern = f"{prefix}%"
    sql = f"SELECT {agg_func}(`{agg_col}`) as result FROM `{table_name}` WHERE `{code_col}` LIKE ? AND `{date_col}` BETWEEN ? AND ?"
    params = (pattern, start_date_str, end_date_str)
    conn = None
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cur = conn.execute(sql, params)
        result = cur.fetchone()
        value = result["result"] if result and result["result"] is not None else None
        meta = {
            "query_type": "aggregation",
            "instrument_pattern": pattern,
            "time_period_days": days,
            "start_date": start_date_str,
            "end_date": end_date_str,
            "aggregation_function": agg_func,
            "aggregation_column": agg_col,
            "sql": sql.strip(),
        }
        body = {"meta": meta, "data": {"result": value}}
        return jsonify(body)
    except Exception as e:
        return jsonify({"error": f"数据库查询失败: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route("/api/publish", methods=["POST"])
def publish_article():
    logging.info("收到 /api/publish (新) 发布请求。")
    data = request.get_json()
    if not data:
        return jsonify({"error": "请求体必须是JSON格式。"}), 400

    title = data.get("title")
    content_plain = data.get("content")
    content_md = data.get("content_md")
    tags = data.get("tags", datetime.now().strftime("%Y%m"))
    targets = data.get("targets")

    if not all([title, content_plain, content_md]):
        return jsonify(
            {
                "error": "请求必须包含 title, content (纯文本), 和 content_md (Markdown)。"
            }
        ), 400

    results = _execute_publishing_flow(title, content_plain, content_md, tags, targets)
    return jsonify(results), 200

@app.route("/api/toutiaopost", methods=["POST"])
def toutiao_post_proxy_compatible():
    logging.info("收到 /api/toutiaopost (兼容) 发布请求。")
    data = request.get_json()
    if not data:
        return jsonify({"error": "请求体必须是JSON格式。"}), 400

    title = data.get("title")
    content_plain = data.get("content")

    if not all([title, content_plain]):
        return jsonify({"error": "标题和内容是必填项。"}), 400

    content_md = data.get("content_md", content_plain)
    tags = data.get("tags", datetime.now().strftime("%Y%m"))
    results = _execute_publishing_flow(title, content_plain, content_md, tags)
    toutiao_result = results.get("toutiao", {})
    toutiao_status = toutiao_result.get("status")

    if toutiao_status == "success":
        logging.info("兼容接口：头条发布成功，返回头条响应。")
        return jsonify(toutiao_result.get("response", {})), 200
    elif toutiao_status == "skipped":
        logging.warning("兼容接口：头条发布被跳过。")
        return jsonify(
            {"error": "发布失败", "details": toutiao_result.get("message")}
        ), 429
    else:
        logging.error("兼容接口：头条发布失败。")
        return jsonify(
            {"error": "发布失败", "details": toutiao_result.get("message")}
        ), 502

@app.route("/api/zhihu/hot", methods=["GET"])
def api_zhihu_hot():
    try:
        limit = int(request.args.get("limit", 20))
        topics = fetch_zhihu_hot_topics()
        if not topics:
            return jsonify({"error": "未获取到知乎热点话题"}), 404
        sorted_topics = sorted(
            topics,
            key=lambda x: int(x["hot"]) if str(x["hot"]).isdigit() else 0,
            reverse=True,
        )
        return jsonify(
            {
                "status": "success",
                "data": sorted_topics[:limit],
                "timestamp": datetime.now().isoformat(),
            }
        )
    except Exception as e:
        logging.error(f"获取知乎热点话题失败: {str(e)}")
        return jsonify({"error": f"获取知乎热点话题失败: {str(e)}"}), 500

@app.route("/api/zhihu/inspiration", methods=["GET"])
def api_zhihu_inspiration():
    try:
        limit = int(request.args.get("limit", 20))
        questions = fetch_zhihu_inspiration_questions()
        if not questions:
            return jsonify({"error": "未获取到知乎灵感问题"}), 404
        sorted_questions = sorted(
            questions,
            key=lambda x: int(x["hot"]) if str(x["hot"]).isdigit() else 0,
            reverse=True,
        )
        return jsonify(
            {
                "status": "success",
                "data": sorted_questions[:limit],
                "timestamp": datetime.now().isoformat(),
            }
        )
    except Exception as e:
        logging.error(f"获取知乎灵感问题失败: {str(e)}")
        return jsonify({"error": f"获取知乎灵感问题失败: {str(e)}"}), 500

@app.route("/api/zhihu/combined", methods=["GET"])
def api_zhihu_combined():
    try:
        hot_limit = int(request.args.get("hot_limit", 15))
        inspiration_limit = int(request.args.get("inspiration_limit", 15))
        hot_topics = fetch_zhihu_hot_topics()
        inspiration_questions = fetch_zhihu_inspiration_questions()
        sorted_hot_topics = sorted(
            hot_topics,
            key=lambda x: int(x["hot"]) if str(x["hot"]).isdigit() else 0,
            reverse=True,
        )
        sorted_inspiration_questions = sorted(
            inspiration_questions,
            key=lambda x: int(x["hot"]) if str(x["hot"]).isdigit() else 0,
            reverse=True,
        )
        return jsonify(
            {
                "status": "success",
                "hotTopics": sorted_hot_topics[:hot_limit],
                "inspirationQuestions": sorted_inspiration_questions[:inspiration_limit],
                "timestamp": datetime.now().isoformat(),
            }
        )
    except Exception as e:
        logging.error(f"获取知乎综合内容失败: {str(e)}")
        return jsonify(
            {
                "error": f"获取知乎综合内容失败: {str(e)}",
                "hotTopics": get_fallback_topics(),
                "inspirationQuestions": get_fallback_inspiration_questions(),
                "timestamp": datetime.now().isoformat(),
            }
        ), 500

@app.route("/api/etf/summary")
@log_execution_time
def api_etf_summary():
    try:
        etf_data = jsl_etf_data()
        return dataframe_to_json_response(pd.DataFrame(etf_data))
    except Exception as e:
        app.logger.error(f"API /api/etf/summary 出错: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/qhlhb")
@app.route("/api/qhlhb/<date_param>")
def api_lhb_summary(date_param=None):
    conn = None
    try:
        if date_param is None:
            date_param = datetime.now().strftime("%Y%m%d")

        conn = sqlite3.connect(DB_PATHS["qhlhb"], timeout=10, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(tradeDate) FROM dailylhb")
        latest_date = cursor.fetchone()[0]

        query = """
            SELECT 
            tradeDate, futureCompanyName, COUNT(*) as onlist,
            SUM(CASE WHEN positionType = '多' THEN 1 ELSE 0 END) as long_count,
            SUM(CASE WHEN positionType = '空' THEN 1 ELSE 0 END) as short_count,
            CASE WHEN SUM(CASE WHEN positionType = '空' THEN 1 ELSE 0 END) = 0 THEN NULL ELSE ROUND(SUM(CASE WHEN positionType = '多' THEN 1 ELSE 0 END) * 1.0 / SUM(CASE WHEN positionType = '空' THEN 1 ELSE 0 END), 2) END as long_short_ratio,
            SUM(CASE WHEN positionType = '多' THEN num ELSE 0 END) as long_position_sum,
            SUM(CASE WHEN positionType = '空' THEN num ELSE 0 END) as short_position_sum,
            SUM(num) as total_position_sum,
            CASE WHEN SUM(CASE WHEN positionType = '空' THEN num ELSE 0 END) = 0 THEN NULL ELSE ROUND(SUM(CASE WHEN positionType = '多' THEN num ELSE 0 END) * 1.0 / SUM(CASE WHEN positionType = '空' THEN num ELSE 0 END), 2) END as long_short_position_ratio
            FROM dailylhb WHERE tradeDate = ? AND contract <> 'ALL'
            GROUP BY tradeDate, futureCompanyName ORDER BY onlist DESC
        """
        cursor.execute(query, (date_param,))
        data = cursor.fetchall()

        if not data and date_param != latest_date:
            date_param = latest_date
            cursor.execute(query, (date_param,))
            data = cursor.fetchall()

        columns = [desc[0] for desc in cursor.description]
        df = pd.DataFrame(data, columns=columns)
        return dataframe_to_json_response(df)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route("/api/ak/methods")
def api_list_ak_methods():
    try:
        all_attributes = dir(ak)
        methods = [attr for attr in all_attributes if callable(getattr(ak, attr)) and not attr.startswith("_")]
        method_docs = {method: (inspect.getdoc(getattr(ak, method)) or "No documentation available") for method in methods}
        return jsonify({"total_methods": len(methods), "methods": method_docs})
    except Exception as e:
        app.logger.error(f"Error in listing AKShare methods: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/ak/<string:api_name>")
def api_fetch_ak_data(api_name):
    try:
        if not hasattr(ak, api_name):
            return jsonify({"error": f"API '{api_name}' not found"}), 404

        f = getattr(ak, api_name)
        params = request.args.to_dict()
        start_time = time.time()
        app.logger.info(f"开始调用 akshare 方法: {api_name} with params: {params}")
        result = f(**params)
        duration = time.time() - start_time
        app.logger.info(f"完成调用 akshare 方法: {api_name}，耗时: {duration:.2f}秒")

        if isinstance(result, pd.DataFrame):
            return dataframe_to_json_response(result)
        else:
            # 对于非DataFrame的结果，也封装在 'data' 键下
            return jsonify({"data": result})
    except Exception as e:
        app.logger.error(f"Error in {api_name}: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/holding/<date:date>/<company>")
@log_execution_time
def api_get_company_holding(date, company):
    date_str = date.strftime("%Y-%m-%d")
    try:
        positionList, topTwentyPositionSum = get_ths_company_holding(date=date_str, company=company)
        sort_by = request.args.get("sort_by", "空单持仓")
        order = request.args.get("order", "desc")

        if sort_by in positionList.columns:
            positionList = positionList.sort_values(by=sort_by, ascending=(order == "asc"))
        if sort_by in topTwentyPositionSum.columns:
            topTwentyPositionSum = topTwentyPositionSum.sort_values(by=sort_by, ascending=(order == "asc"))

        return jsonify({
            "positionList": positionList.to_dict(orient="records"),
            "topTwentyPositionSum": topTwentyPositionSum.to_dict(orient="records"),
            "company": company,
            "date": date_str,
        })
    except Exception as e:
        return jsonify({"error": f"Failed to get data for {company} on {date_str}: {str(e)}"}), 500

@app.route("/api/hq/index")
@log_execution_time
def api_hq_data_f():
    try:
        data = get_exchange_data(index_type=1)
        return dataframe_to_json_response(data)
    except Exception as e:
        app.logger.error(f"Error in get_exchange_data: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/hq/main")
@log_execution_time
def api_hq_data_m():
    try:
        data = get_exchange_data(index_type=0)
        return dataframe_to_json_response(data)
    except Exception as e:
        app.logger.error(f"Error in get_exchange_data: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/basis")
@log_execution_time
def api_get_basis():
    try:
        df = get_ths_basis()
        query = request.args.get("query", "").strip()
        default_only = request.args.get("default_only", "off")

        if query:
            df = df[df["品种"].str.contains(query) | df["现货名"].str.contains(query)]
        if default_only == "on":
            df = df[df["默认"] == "Y"]

        return dataframe_to_json_response(df)
    except Exception as e:
        app.logger.error(f"Error in get_ths_basis: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/stock")
@log_execution_time
def api_get_stock():
    try:
        df = get_ths_stock()
        df = df.drop("market", axis=1)
        df.columns = ["合约名称", "代码", "仓单量", "变化", "变化率", "折期货手数", "更新时间"]
        df = df.sort_values(by="折期货手数", ascending=False)

        query = request.args.get("query", "")
        default_only = request.args.get("default_only", "off")

        if query:
            df = df[(df["合约名称"].str.contains(query)) | (df["代码"].str.contains(query))]
        if default_only == "on":
            df["更新时间"] = pd.to_datetime(df["更新时间"]).dt.date
            current_date = datetime.now().date()
            yesterday_date = (datetime.now() - timedelta(1)).date()
            df_today = df[df["更新时间"] == current_date]
            df = df_today if not df_today.empty else df[df["更新时间"] == yesterday_date]

        return dataframe_to_json_response(df)
    except Exception as e:
        app.logger.error(f"Error in get_ths_stock: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/trading/<variety>/<contract>/<company>")
@log_execution_time
def api_get_trading(variety, contract, company):
    try:
        (df_company_position_list, _, _, _, df_profit_detail_list) = get_ths_trading(variety=variety, contract=contract, company=company)
        df_company_position_list["品种"] = df_company_position_list["品种"].map(CODE_MAP)
        profit_data = df_profit_detail_list.drop("品种名称", axis=1).to_dict(orient="records") if not df_profit_detail_list.empty else {"error": "无盈亏数据"}

        return jsonify({
            "companyPositionList": df_company_position_list.to_dict(orient="records"),
            "profitDetailList": profit_data,
            "company": company,
            "variety": variety,
        })
    except Exception as e:
        app.logger.error(f"Error in get_ths_trading: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/main_force/<company>/<date:date>")
@log_execution_time
def api_get_main_force(company, date):
    try:
        variety_position_list, main_force_trend_list = get_ths_main_force(company=company, date=date.strftime("%Y-%m-%d"))
        sort_by = request.args.get("sort_by", "交易日")
        order = request.args.get("order", "desc")

        if sort_by in variety_position_list.columns:
            variety_position_list = variety_position_list.sort_values(by=sort_by, ascending=(order == "asc"))
        if sort_by in main_force_trend_list.columns:
            main_force_trend_list = main_force_trend_list.sort_values(by=sort_by, ascending=(order == "asc"))

        return jsonify({
            "varietyPositionList": variety_position_list.to_dict(orient="records"),
            "mainForceTrendList": main_force_trend_list.to_dict(orient="records"),
            "company": company,
            "date": date.strftime("%Y-%m-%d"),
        })
    except Exception as e:
        app.logger.error(f"Error in get_ths_main_force: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/ranking/<variety>/<contract>/<date:date>")
@log_execution_time
def api_get_position_ranking(variety, contract, date):
    date_str = date.strftime("%Y-%m-%d")
    try:
        positionList_df, topTwentyPositionSum_df = get_ths_position_ranking(variety, contract, date_str)
        if float(topTwentyPositionSum_df["多空比"].iloc[0]) > 1:
            default_column_name = "多单持仓"
        else:
            default_column_name = "空单持仓"
        sort_by = request.args.get("sort_by", default_column_name)
        order = request.args.get("order", "desc")

        if sort_by in positionList_df.columns:
            positionList_df = positionList_df.sort_values(by=sort_by, ascending=(order == "asc"))
        positionList_df["品种"] = positionList_df["品种"].map(CODE_MAP)

        return jsonify({
            "positionList": positionList_df.to_dict(orient="records"),
            "topTwentyPositionSum": topTwentyPositionSum_df.to_dict(orient="records"),
            "variety": variety.upper(),
            "date": date.strftime("%Y年%m月%d日"),
        })
    except Exception as e:
        app.logger.error(f"Error in get_ths_position_ranking: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/profit/<company>/<variety>/<type_>/<date:start_date>/<date:end_date>")
@log_execution_time
def api_get_profit(company, variety, type_, start_date, end_date):
    try:
        df = get_ths_profit(company=company, variety=variety, type_=type_, start_date=start_date.strftime("%Y-%m-%d"), end_date=end_date.strftime("%Y-%m-%d"))
        sort_by = request.args.get("sort_by", "日盈亏")
        order = request.args.get("order", "desc")

        if sort_by in df.columns:
            df = df.sort_values(by=sort_by, ascending=(order == "asc"))

        return jsonify({
            "profitData": df.to_dict(orient="records"),
            "company": company,
            "variety": variety,
            "type": type_,
            "startDate": start_date.strftime("%Y-%m-%d"),
            "endDate": end_date.strftime("%Y-%m-%d"),
        })
    except Exception as e:
        app.logger.error(f"Error in get_ths_profit: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/klines")
@app.route("/api/klines/<date_param>")
@app.route("/api/klines/<date_param>/<code>")
def api_get_kline_data(date_param=None, code=None):
    conn = None
    try:
        if date_param is None:
            date_param = datetime.now().strftime("%Y%m%d")

        conn = sqlite3.connect(DB_PATHS["klines"], timeout=10, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT date(timestamp) FROM minute_klines ORDER BY timestamp DESC LIMIT 1")
        latest_date_row = cursor.fetchone()
        latest_date = latest_date_row[0] if latest_date_row else date_param

        conditions = ["date(timestamp) = ?"]
        params = [date_param]
        if code:
            conditions.append("code = ?")
            params.append(code.lower())

        query = f"SELECT timestamp, code, open, close, high, low, volume, amount, average, update_time FROM minute_klines WHERE {' AND '.join(conditions)} ORDER BY timestamp ASC, code ASC"
        cursor.execute(query, params)
        data = cursor.fetchall()

        if not data and date_param != latest_date:
            params[0] = latest_date
            cursor.execute(query, params)
            data = cursor.fetchall()
            date_param = latest_date

        columns = [desc[0] for desc in cursor.description]
        df = pd.DataFrame(data, columns=columns)
        return dataframe_to_json_response(df)
    except Exception as e:
        app.logger.error(f"Error in get_kline_data: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# --- 推送服务 API 路由 ---
@app.route("/push/vapid-public-key", methods=["GET"])
def get_vapid_public_key():
    """获取VAPID公钥"""
    if not VAPID_PUBLIC_KEY:
        return jsonify({"error": "VAPID公钥未配置"}), 500
    return jsonify({"publicKey": VAPID_PUBLIC_KEY})

@app.route("/push/debug")
def debug_push_config():
    """调试推送配置"""
    return jsonify({
        "push_api_key": PUSH_API_KEY,
        "env_push_api_key": os.environ.get("PUSH_API_KEY", "未设置"),
        "vapid_private_key_configured": bool(VAPID_PRIVATE_KEY),
        "vapid_public_key_configured": bool(VAPID_PUBLIC_KEY)
    })

# 在你的 data_api.py 文件中

@app.route('/push/send', methods=['POST'])
def send_push_notification():
    # --- START TEMPORARY DEBUG LOGGING ---
    app.logger.info("--- 收到 /push/send 推送请求 ---")
    app.logger.info(f"请求头 (Request Headers): {request.headers}")
    auth_header = request.headers.get('Authorization')
    app.logger.info(f"收到的 Authorization Header: {auth_header}")
    app.logger.info(f"服务器期望的 PUSH_API_KEY: '{PUSH_API_KEY}'")
    # --- END TEMPORARY DEBUG LOGGING ---

    # 1. 验证 Authorization Header
    if not auth_header or not auth_header.startswith('Bearer '):
        app.logger.warning(f"推送请求缺少或格式错误的 Authorization Header，认证失败。")
        return jsonify({"error": "未授权"}), 401

    # 提取 token，注意去除 'Bearer ' 前缀
    token = auth_header.split(' ')[1]
    
    # 比较收到的 token 和期望的 key
    if token != PUSH_API_KEY:
        app.logger.warning(f"推送请求的 Token 无效. 收到: '{token}', 期望: '{PUSH_API_KEY}'。认证失败。")
        return jsonify({"error": "未授权"}), 401
    
    app.logger.info("✅ Authorization Token 验证通过。")

    # 2. 获取请求数据 (后续逻辑保持不变)
    data = request.get_json()
    if not data or 'subscription' not in data or 'payload' not in data:
        app.logger.error(f"推送请求缺少必要参数: {data}")
        return jsonify({"error": "请求参数不完整"}), 400

    subscription_info = data['subscription']
    payload = json.dumps(data['payload'])
    ttl = data.get('ttl', 86400)

    app.logger.info(f"准备向 endpoint 发送推送: {subscription_info.get('endpoint', 'N/A')}")

    if not VAPID_PRIVATE_KEY:
        app.logger.error("VAPID_PRIVATE_KEY 未在环境变量中配置！")
        return jsonify({"error": "服务器VAPID密钥未配置"}), 500

    # 3. 调用 pywebpush 发送
    try:
        webpush(
            subscription_info=subscription_info,
            data=payload,
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS.copy(),
            ttl=ttl
        )
        app.logger.info(f"✅ 成功向 endpoint 发送推送")
        return jsonify({"success": True, "message": "推送已发送"}), 200
    except WebPushException as ex:
        app.logger.error(f"❌ WebPush 发送失败: {ex}")
        if ex.response and ex.response.text:
             # 打印推送服务返回的原始错误信息，非常有用！
            app.logger.error(f"推送服务返回的原始错误: {ex.response.text}")
            try:
                error_details = ex.response.json()
                return jsonify({"error": "推送服务拒绝", "details": error_details}), 410
            except json.JSONDecodeError:
                return jsonify({"error": "推送服务拒绝", "details": ex.response.text}), 410
        return jsonify({"error": str(ex)}), 500
    except Exception as e:
        app.logger.error(f"❌ 发送推送时发生未知错误: {e}", exc_info=True)
        return jsonify({"error": "内部服务器错误"}), 500


@app.route("/api/users/<room_name>/push/subscribe", methods=["POST"])
def register_push_subscription(room_name):
    """注册推送订阅"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "请求体必须是JSON格式"}), 400
        
        username = data.get('username')
        subscription = data.get('subscription')
        
        if not username or not subscription:
            return jsonify({"error": "username和subscription参数必须提供"}), 400
        
        # 保存订阅信息到数据库
        conn = sqlite3.connect('qhlhb.db', timeout=10)
        cursor = conn.cursor()
        
        # 创建推送订阅表（如果不存在）
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS push_subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                room_name TEXT NOT NULL,
                subscription TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(username, room_name)
            )
        ''')
        
        # 插入或更新订阅
        cursor.execute('''
            INSERT OR REPLACE INTO push_subscriptions (username, room_name, subscription)
            VALUES (?, ?, ?)
        ''', (username, room_name, json.dumps(subscription)))
        
        conn.commit()
        conn.close()
        
        app.logger.info(f"用户 {username} 在房间 {room_name} 的推送订阅已注册")
        return jsonify({"success": True, "message": "推送订阅已注册"})
        
    except Exception as e:
        app.logger.error(f"注册推送订阅时发生错误: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/users/<room_name>/push/unregister", methods=["POST"])
def unregister_push_subscription(room_name):
    """注销推送订阅"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "请求体必须是JSON格式"}), 400
        
        username = data.get('username')
        if not username:
            return jsonify({"error": "username参数必须提供"}), 400
        
        conn = sqlite3.connect('qhlhb.db', timeout=10)
        cursor = conn.cursor()
        cursor.execute('''
            DELETE FROM push_subscriptions WHERE username = ? AND room_name = ?
        ''', (username, room_name))
        conn.commit()
        conn.close()
        
        app.logger.info(f"用户 {username} 在房间 {room_name} 的推送订阅已注销")
        return jsonify({"success": True, "message": "推送订阅已注销"})
        
    except Exception as e:
        app.logger.error(f"注销推送订阅时发生错误: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/users/<room_name>/push/offline", methods=["GET"])
def get_offline_push_users(room_name):
    """获取离线用户列表（用于推送通知）"""
    try:
        conn = sqlite3.connect('qhlhb.db', timeout=10)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT username, subscription FROM push_subscriptions
            WHERE room_name = ?
        ''', (room_name,))
        
        users = []
        for row in cursor.fetchall():
            try:
                subscription = json.loads(row['subscription'])
                users.append({
                    "username": row['username'],
                    "subscription": subscription
                })
            except json.JSONDecodeError:
                app.logger.warning(f"用户 {row['username']} 的订阅数据格式错误")
                continue
        
        conn.close()
        
        return jsonify({"users": users})
        
    except Exception as e:
        app.logger.error(f"获取离线用户列表时发生错误: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


from flask import make_response
import xmltodict
from WXBizMsgCrypt import WXBizMsgCrypt

# 企业微信回调配置（务必与管理后台一致）
WECHAT_CALLBACK_TOKEN = os.getenv("WECHAT_CALLBACK_TOKEN", "WeChatTestToken123")
WECHAT_CALLBACK_AES_KEY = os.getenv("WECHAT_CALLBACK_AES_KEY", "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG")
WECHAT_CORP_ID = os.getenv("WECHAT_CORP_ID", None)  # 推荐从环境变量设置
WECHAT_CALLBACK_MODE = os.getenv("WECHAT_CALLBACK_MODE", "aes").lower()

from wechat import WeChat
wechat_client = WeChat()
if not WECHAT_CORP_ID:
    WECHAT_CORP_ID = getattr(wechat_client, "_corpid", None)

def _wxcpt():
    return WXBizMsgCrypt(WECHAT_CALLBACK_TOKEN, WECHAT_CALLBACK_AES_KEY, WECHAT_CORP_ID or "")

def _encrypt_if_needed(text: str, timestamp: str, nonce: str):
    if WECHAT_CALLBACK_MODE == "aes":
        ret, sEncryptMsg = _wxcpt().EncryptMsg(text, timestamp, nonce)
        if ret != 0:
            app.logger.error(f"EncryptMsg 失败 ret={ret}，返回明文 success")
            resp = make_response("success", 200)
            resp.headers["Content-Type"] = "text/plain; charset=utf-8"
            return resp
        resp = make_response(sEncryptMsg, 200)
        resp.headers["Content-Type"] = "application/xml; charset=utf-8"
        return resp
    else:
        resp = make_response(text, 200)
        resp.headers["Content-Type"] = "text/plain; charset=utf-8"
        return resp

def handle_template_card_event(event_dict: dict):
    try:
        from_user = event_dict.get("FromUserName")
        agent_id = event_dict.get("AgentID") or getattr(wechat_client, "_agentid", None)
        response_code = event_dict.get("ResponseCode")
        task_id = event_dict.get("TaskId")
        event_key = event_dict.get("EventKey")

        app.logger.info(f"模板卡片事件: from={from_user}, agent={agent_id}, task={task_id}, event_key={event_key}, response_code={response_code}")
        if not response_code:
            return

        replace_card_payload = {
            "agentid": agent_id,
            "response_code": response_code,
            "replace_card": {
                "card_type": "text_notice",
                "main_title": {"title": f"“{event_key or '操作'}”已响应", "desc": f"任务ID: {task_id}"},
                "horizontal_content_list": [
                    {"keyname": "响应时间", "value": datetime.now().strftime('%Y-%m-%d %H:%M:%S')},
                    {"keyname": "操作按钮", "value": event_key or "-"}
                ],
                "card_action": {"type": 0}
            }
        }
        wechat_client.updateTemplateCard(replace_card_payload)
    except Exception as e:
        app.logger.error(f"处理模板卡片事件异常: {e}", exc_info=True)

@app.route('/wechat/callback', methods=['GET', 'POST', 'HEAD'])
def wechat_callback():
    msg_signature = request.args.get("msg_signature", "")
    timestamp = request.args.get("timestamp", "")
    nonce = request.args.get("nonce", "")

    # 0) HEAD 探测：直接 200
    if request.method == "HEAD":
        return make_response("", 200)

    # 1) URL 验证（GET + 带签名参数）
    if request.method == 'GET':
        echostr = request.args.get('echostr', "")
        # 无参数 GET：作为连通性探测，返回 200/ok，避免后台保存时报 -30065
        if not (msg_signature and timestamp and nonce and echostr):
            return make_response("ok", 200)
        ret, sEchoStr = _wxcpt().VerifyURL(msg_signature, timestamp, nonce, echostr)
        app.logger.info(f"VerifyURL ret={ret}")
        if ret != 0:
            return make_response("validation failed", 401)
        resp = make_response(sEchoStr, 200)
        resp.headers["Content-Type"] = "text/plain; charset=utf-8"
        return resp

    # 2) 事件与消息（POST）
    try:
        raw = request.data  # bytes
        if WECHAT_CALLBACK_MODE == "aes":
            ret, sMsg = _wxcpt().DecryptMsg(raw, msg_signature, timestamp, nonce)
            app.logger.info(f"DecryptMsg ret={ret}")
            if ret != 0:
                # 返回加密或明文的 success，避免重试
                return _encrypt_if_needed("success", timestamp or str(int(time.time())), nonce or "nonce")
            xml_str = sMsg
        else:
            xml_str = raw.decode("utf-8", errors="ignore")

        data = xmltodict.parse(xml_str).get("xml", {}) or {}
        app.logger.info(f"回调解析: {json.dumps(data, ensure_ascii=False)}")

        msg_type = (data.get("MsgType") or "").lower()
        event = (data.get("Event") or "").lower()
        if msg_type == "event" and event == "template_card_event":
            handle_template_card_event(data)
        # 其他事件按需处理...

    except Exception as e:
        app.logger.error(f"POST 回调处理异常: {e}", exc_info=True)

    # 按规范返回 success（加密模式需加密XML）
    return _encrypt_if_needed("success", timestamp or str(int(time.time())), nonce or "nonce")


@app.route('/weixinpush', methods=['POST'])
def weixin_push():
    """
    微信推送接口，支持各类通知的发送
    请求体 JSON 格式：
    {
        "msgtype": "text",  // 支持: text, image, image_file, news, mpnews, task_card, template_card
        "content": "消息内容",  // text类型时必需
        "media_id": "MEDIA_ID",  // image类型时必需
        "file_name": "/path/to/image.jpg",  // image_file类型时必需
        "articles": [...],  // news和mpnews类型时必需
        "template_card": {...},  // template_card类型时必需
        "task_card": {...},  // task_card类型时必需
        "to_user": "@all"  // 可选，指定接收用户，默认为@all
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "请求体必须是JSON格式"}), 400

        msgtype = data.get("msgtype")
        if not msgtype:
            return jsonify({"error": "缺少msgtype参数"}), 400

        to_user = data.get("to_user", "@all")

        # 确保wechat_client已初始化
        if not hasattr(wechat_client, 'sendMsg'):
            return jsonify({"error": "微信客户端未正确初始化"}), 500

        # 根据消息类型发送不同类型的推送
        if msgtype == "text":
            content = data.get("content")
            if not content:
                return jsonify({"error": "发送文本消息时content参数不能为空"}), 400
            
            success = wechat_client.sendMsg(content, to_user)
            if success:
                return jsonify({"status": "success", "message": "文本消息发送成功"})
            else:
                return jsonify({"status": "error", "message": "文本消息发送失败"}), 500

        elif msgtype == "image":
            media_id = data.get("media_id")
            if not media_id:
                return jsonify({"error": "发送图片消息时media_id参数不能为空"}), 400
            
            success = wechat_client.sendPicture(media_id, to_user)
            if success:
                return jsonify({"status": "success", "message": "图片消息发送成功"})
            else:
                return jsonify({"status": "error", "message": "图片消息发送失败"}), 500

        elif msgtype == "image_file":
            file_name = data.get("file_name")
            if not file_name:
                return jsonify({"error": "发送图片文件时file_name参数不能为空"}), 400
            
            success = wechat_client.sendPictureFile(file_name, to_user)
            if success:
                return jsonify({"status": "success", "message": "图片文件发送成功"})
            else:
                return jsonify({"status": "error", "message": "图片文件发送失败"}), 500

        elif msgtype == "news":
            articles = data.get("articles")
            if not articles:
                return jsonify({"error": "发送图文消息时articles参数不能为空"}), 400
            
            success = wechat_client.sendNews(articles, to_user)
            if success:
                return jsonify({"status": "success", "message": "图文消息发送成功"})
            else:
                return jsonify({"status": "error", "message": "图文消息发送失败"}), 500

        elif msgtype == "mpnews":
            articles = data.get("articles")
            if not articles:
                return jsonify({"error": "发送富图文消息时articles参数不能为空"}), 400
            
            success = wechat_client.sendMpNews(articles, to_user)
            if success:
                return jsonify({"status": "success", "message": "富图文消息发送成功"})
            else:
                return jsonify({"status": "error", "message": "富图文消息发送失败"}), 500

        elif msgtype == "task_card":
            task_card = data.get("task_card")
            if not task_card:
                return jsonify({"error": "发送任务卡片时task_card参数不能为空"}), 400
            
            # 提取任务卡片参数
            title = task_card.get("title", "任务标题")
            desc = task_card.get("desc", "任务描述")
            content_list = task_card.get("content_list")
            task_id = task_card.get("task_id")
            command_str = task_card.get("command_str", "")
            button_selection_dict = task_card.get("button_selection_dict")
            button_list = task_card.get("button_list")
            
            success = wechat_client.sendTaskCard(
                title=title,
                desc=desc,
                content_list=content_list,
                task_id=task_id,
                to_user=to_user,
                command_str=command_str,
                button_selection_dict=button_selection_dict,
                button_list=button_list
            )
            if success:
                return jsonify({"status": "success", "message": "任务卡片发送成功"})
            else:
                return jsonify({"status": "error", "message": "任务卡片发送失败"}), 500

        elif msgtype == "template_card":
            template_card = data.get("template_card")
            if not template_card:
                return jsonify({"error": "发送模板卡片时template_card参数不能为空"}), 400
            
            card_type = template_card.get("card_type", "text_notice")
            
            success = wechat_client.sendTemplateCard(
                card_type,
                to_user,
                **{k: v for k, v in template_card.items() if k != "card_type"}
            )
            if success:
                return jsonify({"status": "success", "message": "模板卡片发送成功"})
            else:
                return jsonify({"status": "error", "message": "模板卡片发送失败"}), 500

        else:
            return jsonify({"error": f"不支持的消息类型: {msgtype}"}), 400

    except Exception as e:
        app.logger.error(f"微信推送接口异常: {e}", exc_info=True)
        return jsonify({"error": f"服务器内部错误: {str(e)}"}), 500


# =====================================================================
# --- 6. YouTube Music API 路由 ---
# =====================================================================


@app.route('/youtubeapi/search/song', methods=['GET'])
@log_execution_time
def youtube_search_song():
    """搜索歌曲接口"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    query = request.args.get('q', '')
    limit = request.args.get('limit', 5, type=int)
    
    if not query:
        return jsonify({'success': False, 'error': '缺少搜索关键词 (参数: q)'}), 400
    
    if limit < 1 or limit > 50:
        return jsonify({'success': False, 'error': 'limit 参数必须在 1-50 之间'}), 400
    
    try:
        result = search_song(query, limit)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 搜索歌曲失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/youtubeapi/search/artist', methods=['GET'])
@log_execution_time
def youtube_search_artist():
    """搜索艺术家接口"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    query = request.args.get('q', '')
    limit = request.args.get('limit', 5, type=int)
    
    if not query:
        return jsonify({'success': False, 'error': '缺少搜索关键词 (参数: q)'}), 400
    
    if limit < 1 or limit > 50:
        return jsonify({'success': False, 'error': 'limit 参数必须在 1-50 之间'}), 400
    
    try:
        result = search_artist(query, limit)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 搜索艺术家失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/youtubeapi/artist/<channel_id>', methods=['GET'])
@log_execution_time
def youtube_get_artist(channel_id):
    """获取艺术家详细信息接口"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    try:
        result = get_artist_info(channel_id)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 获取艺术家信息失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/youtubeapi/lyrics/<video_id>', methods=['GET'])
@log_execution_time
def youtube_get_lyrics(video_id):
    """获取歌词接口"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    try:
        result = get_lyrics(video_id)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 获取歌词失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/youtubeapi/song/<video_id>', methods=['GET'])
@log_execution_time
def youtube_get_song_details(video_id):
    """获取歌曲完整信息接口（包括歌词）"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    try:
        result = get_song_details(video_id)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 获取歌曲详情失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


# --- 7. 启动入口 ---
if __name__ == "__main__":
    try:
        update_zhihu_headers()
    except Exception as e:
        app.logger.warning(f"启动时更新知乎头信息失败: {e}")

    if not VAPID_PRIVATE_KEY or not VAPID_PUBLIC_KEY:
        app.logger.warning("⚠️ 缺少 VAPID 密钥配置. 推送服务可能无法正常工作")
    else:
        app.logger.info("✅ VAPID 密钥配置已加载")
    
    app.logger.info("数据API服务启动 (最终完整修复版，含Web推送服务和微信回调)")
    app.run(host="0.0.0.0", port=5000, debug=False)
