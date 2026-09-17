#!/usr/bin/env python3
"""构建小学词汇表静态数据（tools/vocab_source_沪教版.md → vocab_primary.json）。

流程：
1. 解析 markdown 词表（__大类__ / ①子类 / `word | meaning` 行）
2. 词形规范化：展开 = 与括号变体（bike=bicycle、Mom（美Mum）→ bike/bicycle/Mom/Mum）
3. 逐词调用 uapis.cn 词典接口补音标（英式优先）与词性；增量缓存 .vocab_phonetic_cache.json，
   中断后重跑只补缺失部分
4. 输出 vocab_primary.json（页面 词汇表 功能的数据源）并同步到 deploy/

用法：python3 tools/build_vocab.py [--dry]   （--dry 只解析不请求接口）
"""
import json
import re
import sys
import time
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "vocab_source_沪教版.md"
OUT = ROOT / "vocab_primary.json"
DEPLOY_OUT = ROOT / "deploy" / "vocab_primary.json"
CACHE = ROOT / ".vocab_phonetic_cache.json"

UAPI = "https://uapis.cn/api/v1/dictionary/lookup?word={w}"
DEV_API = "https://api.dictionaryapi.dev/api/v2/entries/en/{w}"
DELAY = 0.25          # 每次请求间隔，避免触发限流
RETRY = 2

POS_MAP = {
    "noun": "n.", "verb": "v.", "adjective": "adj.", "adverb": "adv.",
    "preposition": "prep.", "conjunction": "conj.", "pronoun": "pron.",
    "interjection": "int.", "exclamation": "int.", "numeral": "num.",
    "determiner": "det.", "auxiliary": "aux.",
}

# 源表格中的明显笔误修正
TYPO_FIX = {
    "granddaughger": "granddaughter",
}

CN_NUM = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"


def clean_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def parse_source(path: Path):
    """返回 (entries, cats)。entry = {w(原词文本), zh, cat}"""
    entries, cats = [], []
    major = ""
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = clean_ws(raw)
        if not line:
            continue
        m = re.match(r"^__\s*(\d+)、\s*(.+?)\s*__$", line)
        if m:
            major = clean_ws(m.group(2))
            major = major.replace(".getNum", "").strip()
            if major not in cats:
                cats.append(major)
            continue
        if len(line) >= 2 and line[0] in CN_NUM:
            continue  # 子类标题，暂不入库（筛选按大类）
        if line.startswith("#"):
            continue
        if "|" not in line:
            continue
        parts = [clean_ws(p) for p in line.split("|") if clean_ws(p)]
        if len(parts) < 2:
            continue
        word, meaning = parts[0], parts[1]
        if not word or not meaning:
            continue
        entries.append({"w": word, "zh": meaning, "cat": major})
    return entries, cats


def expand_word(raw: str):
    """把 bike=bicycle / Mom（美Mum） / grey / gray 这类写法展开成多个词条。"""
    raw = clean_ws(raw)
    words = [raw]
    # '=' 两侧都收录（bike=bicycle）
    if "=" in raw:
        sides = [clean_ws(x) for x in raw.split("=")]
        words = [x for x in sides if x]
    # 括号变体：Mom（美Mum）→ Mom + Mum；policeman（policewoman）→ 两者
    expanded = []
    for w in words:
        head = re.split(r"[（(]", w)[0].strip()
        if head:
            expanded.append(head)
        for inner in re.findall(r"[（(]([^（）()]+)[)）]", w):
            inner = re.sub(r"^[美英]\s*", "", clean_ws(inner)).strip(" .")
            if re.fullmatch(r"[A-Za-z][A-Za-z .'-]{2,}", inner):
                expanded.append(inner)
    # '/' 变体：grey / gray
    final = []
    for w in expanded:
        parts = [clean_ws(p) for p in w.split("/")]
        if len(parts) > 1 and all(re.fullmatch(r"[A-Za-z][A-Za-z .'-]*", p) for p in parts if p):
            final += [p for p in parts if p]
        else:
            final.append(w)
    return [clean_ws(w) for w in final if clean_ws(w)]


def _norm_ipa(s: str) -> str:
    """去掉首尾斜杠（渲染时统一加）。"""
    return (s or "").strip().strip("/").strip()


def lookup_uapis_style(url: str):
    """uapis 格式解析（直连与 Worker 代理共用）。"""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "kk-dict-vocab/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        if not data.get("found") or not isinstance(data.get("entry"), dict):
            return None
        entry = data["entry"]
        ph = entry.get("phonetics") or {}
        ipa = (ph.get("uk") or {}).get("text") or (ph.get("us") or {}).get("text") or ""
        pos = ""
        defs = entry.get("definitions") or []
        if defs:
            m = re.match(r"^([a-z]+\.)\s*", str(defs[0].get("meaning", "")))
            if m:
                pos = m.group(1)
        if not ipa:
            return None
        return {"ipa": _norm_ipa(ipa), "pos": pos}
    except Exception:
        return None


def lookup_worker(word: str):
    """走 dict.want.biz 的 Worker 代理（Cloudflare 出口，不受本机限流影响）。"""
    return lookup_uapis_style(
        "https://dict.want.biz/api/uapi/lookup?word=" + urllib.request.quote(word.lower())
    )


def lookup_dev(word: str):
    """dictionaryapi.dev 作为兜底数据源。"""
    url = DEV_API.format(w=urllib.request.quote(word.lower()))
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "kk-dict-vocab/1.0"})
        with urllib.request.urlopen(req, timeout=6) as resp:
            entries = json.loads(resp.read().decode("utf-8"))
        if not isinstance(entries, list) or not entries:
            return None
        e0 = entries[0]
        ipa = e0.get("phonetic") or ""
        if not ipa:
            for p in e0.get("phonetics") or []:
                if p.get("text"):
                    ipa = p["text"]
                    break
        pos = ""
        meanings = e0.get("meanings") or []
        if meanings:
            pos = POS_MAP.get(meanings[0].get("partOfSpeech", ""), meanings[0].get("partOfSpeech", ""))
        if not ipa and not pos:
            return None
        return {"ipa": _norm_ipa(ipa), "pos": pos}
    except Exception:
        return None


def lookup_uapis(word: str):
    return lookup_uapis_style(UAPI.format(w=urllib.request.quote(word.lower())))


def main():
    dry = "--dry" in sys.argv
    entries, cats = parse_source(SRC)
    print(f"解析到 {len(entries)} 行词条，{len(cats)} 个大类", flush=True)

    # 展开变体 + 修正笔误 + 去重（保留首次出现的分类与释义）
    words = {}
    order = []
    for e in entries:
        for w in expand_word(e["w"]):
            w = TYPO_FIX.get(w, w)
            key = w.lower()
            if key in words:
                continue
            words[key] = {"w": w, "zh": e["zh"], "cat": e["cat"]}
            order.append(key)
    print(f"规范化去重后：{len(order)} 词", flush=True)
    if dry:
        for key in order[:20]:
            print("  样例:", words[key])
        return 0

    cache = {}
    if CACHE.exists():
        cache = json.loads(CACHE.read_text(encoding="utf-8"))
    # 关键修正：空结果不作为有效缓存（限流期间的失败会在下次运行时自动重试）
    before = len(cache)
    cache = {k: v for k, v in cache.items() if v.get("ipa")}
    dropped = before - len(cache)
    if dropped:
        print(f"清理限流期产生的空缓存 {dropped} 条，将重新查询", flush=True)

    done = 0
    misses = []
    for i, key in enumerate(order):
        if key in cache:
            continue
        info = lookup_worker(key) or lookup_uapis(key) or lookup_dev(key)
        if info:
            cache[key] = info
        else:
            misses.append(key)
        done += 1
        if done % 50 == 0:
            CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
            print(f"  进度 {i + 1}/{len(order)}（本轮新查 {done}，待重试 {len(misses)}）", flush=True)
        time.sleep(DELAY)
    CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
    print(f"音标/词性查询完成：缓存 {len(cache)} 条，未查到 {len(misses)} 条", flush=True)
    if misses:
        (ROOT / ".vocab_missing.txt").write_text("\n".join(misses), encoding="utf-8")
        print(f"  未查到清单已写入 .vocab_missing.txt（多为专有名词/短语，页面显示为 —）", flush=True)

    cat_rank = {c: i for i, c in enumerate(cats)}
    out_words = []
    missing_ipa = 0
    for key in sorted(order, key=lambda k: (cat_rank.get(words[k]["cat"], 99), k)):
        info = cache.get(key, {"ipa": "", "pos": ""})
        if not info.get("ipa"):
            missing_ipa += 1
        out_words.append({
            "w": words[key]["w"],
            "ipa": info.get("ipa", ""),
            "pos": info.get("pos", ""),
            "zh": words[key]["zh"],
            "cat": words[key]["cat"],
        })

    payload = {
        "generated": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "source": "沪教版小学英语词汇分类速记表",
        "count": len(out_words),
        "cats": cats,
        "words": out_words,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    DEPLOY_OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"完成：{len(out_words)} 词（缺音标 {missing_ipa}），输出 {OUT.name}（{OUT.stat().st_size // 1024} KB）", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
