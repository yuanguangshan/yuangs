#!/usr/bin/env python3
"""dict.html 的本地服务器：静态文件 + 经济学人例句/词典数据代理 API。

用法：python3 tools/server.py [端口]   （默认 8765）
接口：
  /api/sentences?word=xxx        →  {"word": "xxx", "sentences": ["...", ...]}
  /api/uapi/lookup?word=xxx      →  代理 uapis.cn 词典查询（音标/发音/释义）
"""
import json
import mmap
import re
import sys
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote

ROOT = Path(__file__).resolve().parent.parent
CORPUS = ROOT / "corpus" / "economist_sentences.jsonl"
MAX_RESULTS = 40

# 进程内结果缓存（简单 FIFO 淘汰），避免每次查询都扫 224MB 语料
SENT_CACHE = {}
SENT_CACHE_CAP = 300
UAPI_CACHE = {}
UAPI_CACHE_CAP = 300

def _cache_get(store, cap, key):
    if key in store:
        store[key] = store.pop(key)  # 移到末尾，近似 LRU
        return store[key]
    return None

def _cache_put(store, cap, key, value):
    store[key] = value
    while len(store) > cap:
        store.pop(next(iter(store)))

MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".jsonl": "application/octet-stream",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
}


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body, content_type):
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/sentences":
            self.handle_sentences(parse_qs(parsed.query))
            return

        if parsed.path == "/api/uapi/lookup":
            self.handle_uapi(parse_qs(parsed.query))
            return

        if parsed.path == "/api/uapi/daily":
            self.handle_uapi_daily()
            return

        if parsed.path == "/api/uapi/audio":
            self.handle_uapi_audio(parse_qs(parsed.query))
            return

        # 静态文件
        name = unquote(parsed.path)
        if name == "/":
            name = "/index.html"
        file_path = (ROOT / name.lstrip("/")).resolve()
        if not str(file_path).startswith(str(ROOT)) or not file_path.is_file():
            self._send(404, b"Not Found", "text/plain; charset=utf-8")
            return
        self._send(200, file_path.read_bytes(), MIME.get(file_path.suffix, "application/octet-stream"))

    def handle_sentences(self, qs):
        word = (qs.get("word") or [""])[0].strip().lower()
        if not re.fullmatch(r"[a-z][a-z'-]*", word):
            self._send_json(400, {"error": "invalid word"})
            return
        if not CORPUS.exists():
            self._send_json(200, {"word": word, "sentences": [], "error": "语料库未构建，请先运行 tools/build_corpus.py"})
            return

        cached = _cache_get(SENT_CACHE, SENT_CACHE_CAP, word)
        if cached is not None:
            self._send_json(200, {"word": word, "sentences": cached})
            return

        pattern = re.compile(
            r"(?<![A-Za-z])" + re.escape(word) + r"[a-z]{0,3}(?![A-Za-z])",
            re.IGNORECASE,
        )
        sentences = []
        with CORPUS.open("rb") as f:
            with mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as mm:
                for line in iter(mm.readline, b""):
                    if len(sentences) >= MAX_RESULTS:
                        break
                    try:
                        item = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    s = item["s"]
                    if pattern.search(s):
                        sentences.append(s)
        _cache_put(SENT_CACHE, SENT_CACHE_CAP, word, sentences)
        self._send_json(200, {"word": word, "sentences": sentences})

    def handle_uapi(self, qs):
        word = (qs.get("word") or [""])[0].strip().lower()
        if not re.fullmatch(r"[a-z][a-z'-]{0,30}", word):
            self._send_json(400, {"found": False, "error": "invalid word"})
            return
        cached = _cache_get(UAPI_CACHE, UAPI_CACHE_CAP, word)
        if cached is not None:
            self._send(200, cached, "application/json; charset=utf-8")
            return
        try:
            req = urllib.request.Request(
                f"https://uapis.cn/api/v1/dictionary/lookup?word={word}",
                headers={"User-Agent": "kk-dict-proxy/1.0"},
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                body = resp.read()
            _cache_put(UAPI_CACHE, UAPI_CACHE_CAP, word, body)
            self._send(200, body, "application/json; charset=utf-8")
        except Exception as e:
            self._send_json(502, {"found": False, "error": str(e)})

    def handle_uapi_daily(self):
        try:
            req = urllib.request.Request(
                "https://uapis.cn/api/v1/daily/word",
                headers={"User-Agent": "kk-dict-proxy/1.0"},
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                body = resp.read()
            self._send(200, body, "application/json; charset=utf-8")
        except Exception as e:
            self._send_json(502, {"error": str(e)})

    def handle_uapi_audio(self, qs):
        word = (qs.get("word") or [""])[0].strip().lower()
        accent = (qs.get("accent") or ["us"])[0].strip().lower()
        if not re.fullmatch(r"[a-z][a-z'-]{0,30}", word) or accent not in ("uk", "us"):
            self._send(400, b"Bad Request", "text/plain; charset=utf-8")
            return
        try:
            req = urllib.request.Request(
                f"https://uapis.cn/api/v1/dictionary/audio?word={word}&accent={accent}",
                headers={"User-Agent": "kk-dict-proxy/1.0"},
            )
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read()
            self._send(200, body, resp.headers.get("Content-Type", "audio/mpeg"))
        except Exception:
            self._send(502, b"Upstream Error", "text/plain; charset=utf-8")

    def _send_json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self._send(code, body, "application/json; charset=utf-8")

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    print(f"服务已启动：http://127.0.0.1:{port}/dict.html", flush=True)
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
