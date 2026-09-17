#!/usr/bin/env python3
"""把 economist_sentences.jsonl 离线预构建成"单词 → 例句"静态分片（v2）。

相对 v1 的改进（2026-09-17）：
1. 词形还原：用 lemminflect 把 running/ran/bought/worse 等屈折形式的例句
   聚合到词元（run/buy/good）名下，查原形即可全量召回不规则变化。
2. 二级分片：体积超过 SPLIT_THRESHOLD 的大字母自动拆成两字母前缀文件
   （sa.json / se.json / st.json ...），单文件控制在 3MB 内，
   避免移动端 JSON.parse 大分片造成主线程卡顿。
3. 版本目录 + manifest：分片写入 corpus_shards/v<内容哈希>/，
   manifest.json（不缓存）记录版本号与拆分字母；分片文件内容不变可
   永久缓存，语料更新 = 新版本目录 + 新 manifest，前端无需改动。

输出：
  corpus_shards/manifest.json        {"version": "v<hash8>", "twoLetter": [...], ...}
  corpus_shards/v<hash8>/{分片}.json {"word": ["例句1", ...]}

用法：python3 tools/build_shards.py
"""
import hashlib
import json
import re
import shutil
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "corpus" / "economist_sentences.jsonl"
OUT = ROOT / "corpus_shards"
MANIFEST = ROOT / "corpus_manifest.json"   # 放站点根：避开 /corpus_shards/* 的长缓存通配规则
MAX_PER_WORD = 8        # 每个单词最多保留的例句数
MAX_SENT_LEN = 240      # 过长句子直接丢弃（多为表格残留）
SPLIT_THRESHOLD = 3 * 1024 * 1024   # 字母分片超过 3MB 拆成两字母前缀
KEEP_OLD_VERSIONS = 1   # 保留最近 N 个旧版本目录用于回滚

WORD_RE = re.compile(r"[a-z][a-z'-]{1,}")
STOP = set("the a an and or but of to in on at for with by from as is are was were be been being it its this that these those he she they them his her their not no so if then than which who whom whose what when where how why all any some more most other into over under out up down about after before between during without within also just only very can could will would should may might must shall do does did done have has had having i you we us our your".split())

# ---- 词形还原：生产构建的核心依赖。缺失时必须显式传 --allow-no-lemma 才能降级构建 ----
try:
    from lemminflect import getAllLemmas
    _LEMMA_CACHE = {}

    def lemma_of(w: str) -> str:
        """取最短词元：running→run、ran→run、worse→bad、stories→story。"""
        if w in _LEMMA_CACHE:
            return _LEMMA_CACHE[w]
        lemmas = [x for tup in getAllLemmas(w).values() for x in tup if x.isalpha()]
        best = min(lemmas, key=len) if lemmas else w
        _LEMMA_CACHE[w] = best
        return best

    HAS_LEMMA = True
except ImportError:
    HAS_LEMMA = False

    def lemma_of(w: str) -> str:
        return w


def main():
    allow_no_lemma = "--allow-no-lemma" in sys.argv
    if not HAS_LEMMA and not allow_no_lemma:
        # 词形还原是线上检索质量的核心能力，正式构建缺失核心依赖必须失败，
        # 不允许静默产出功能退化的分片（开发调试可显式加 --allow-no-lemma）
        print("✗ 缺少核心依赖 lemminflect。请先：pip3 install -r requirements.txt\n"
              "  （开发调试确需跳过词形还原：python3 tools/build_shards.py --allow-no-lemma）", file=sys.stderr)
        return 1
    if not SRC.exists():
        print("先运行 tools/build_corpus.py 生成语料库", file=sys.stderr)
        return 1

    index = defaultdict(list)
    with SRC.open(encoding="utf-8") as f:
        for line in f:
            item = json.loads(line)
            s = item["s"]
            if len(s) > MAX_SENT_LEN:
                continue
            words = {w for w in WORD_RE.findall(s.lower()) if w not in STOP and len(w) <= 20}
            for w in words:
                if len(index[w]) < MAX_PER_WORD:
                    index[w].append(s)
            # 词形还原聚合：running/ran 的例句也挂到 run 名下（去重、同上限）
            if HAS_LEMMA:
                for w in words:
                    lemma = lemma_of(w)
                    if lemma != w and lemma not in STOP and len(lemma) <= 20 \
                            and len(index[lemma]) < MAX_PER_WORD and s not in index[lemma]:
                        index[lemma].append(s)
    print(f"词汇量：{len(index)}（词形还原：{'开' if HAS_LEMMA else '关'}）", flush=True)

    # 一级：按首字母组装
    first = defaultdict(dict)
    for w, sents in index.items():
        first[w[0]][w] = sents

    # 二级：大字母拆两字母前缀（前端用 word[:2] 定位文件，两侧规则一致）
    files = {}
    two_letter = []
    for letter, words in sorted(first.items()):
        size = len(json.dumps(words, ensure_ascii=False, separators=(",", ":")).encode())
        if size > SPLIT_THRESHOLD and len(letter) == 1 and letter.isalpha():
            two_letter.append(letter)
            sub = defaultdict(dict)
            for w, sents in words.items():
                sub[w[:2]][w] = sents
            for pfx, ws in sorted(sub.items()):
                files[f"{pfx}.json"] = ws
            print(f"{letter}.json → 拆分为 {len(sub)} 个两字母前缀（原 {size // 1024} KB）", flush=True)
        else:
            files[f"{letter}.json"] = words

    # 版本号 = 全部分片内容哈希（内容不变则版本不变，不产生无效部署）
    h = hashlib.sha256()
    for name in sorted(files):
        h.update(name.encode())
        h.update(json.dumps(files[name], sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode())
    version = "v" + h.hexdigest()[:8]

    vdir = OUT / version
    vdir.mkdir(parents=True, exist_ok=True)
    total = 0
    for name, ws in files.items():
        path = vdir / name
        path.write_text(json.dumps(ws, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        total += path.stat().st_size

    manifest = {
        "version": version,
        "twoLetter": sorted(two_letter),
        "hasLemma": HAS_LEMMA,
        "generated": datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    (MANIFEST).write_text(json.dumps(manifest, ensure_ascii=False), encoding="utf-8")

    # 清理：只保留当前版本 + 最近 KEEP_OLD_VERSIONS 个旧版本；删除 v1 时代的散装 {a-z}.json
    old_dirs = sorted((p for p in OUT.glob("v*") if p.is_dir() and p.name != version),
                      key=lambda p: p.stat().st_mtime, reverse=True)
    for p in old_dirs[KEEP_OLD_VERSIONS:]:
        shutil.rmtree(p)
    for p in OUT.glob("*.json"):
        p.unlink()

    print(f"\n版本：{version}  分片数：{len(files)}  两字母拆分：{'/'.join(two_letter) or '无'}", flush=True)
    print(f"总大小：{total // 1024 // 1024} MB（未压缩）", flush=True)
    biggest = max(vdir.glob('*.json'), key=lambda p: p.stat().st_size)
    print(f"最大分片：{biggest.name} {biggest.stat().st_size // 1024} KB", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
