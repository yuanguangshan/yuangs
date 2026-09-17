#!/usr/bin/env python3
"""词形归并回归测试：对照本地 corpus_shards，验证关键查询的召回预期。

每次重建分片后运行（make test），用于发现检索能力退化：
- 不规则变化聚合：run 应召回 ran/running 的句子
- 歧义词表面形式保留：saw/left/found/lying/axes 自身键必须存在
- 二级分片路由：hyphen 词（e-mail → e-.json）等路径可达

用法：python3 tools/regression_check.py   （退出码非 0 = 有失败）
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHARDS = ROOT / "corpus_shards"

# (查询词, 检查类型, 参数)
# exists  = 该词自身的键必须存在
# mention = 该词的键下必须出现包含参数中任一词形的句子（词形还原聚合的召回保证）
CASES = [
    ("run", "mention", ["ran", "running", "runs"]),
    ("run", "exists", None),
    ("running", "exists", None),
    ("bought", "exists", None),
    ("buy", "mention", ["bought", "buying"]),
    ("worse", "exists", None),
    ("saw", "exists", None),
    ("left", "exists", None),
    ("found", "exists", None),
    ("lying", "exists", None),
    ("slack", "exists", None),
    ("government", "exists", None),
]
# 软检查：不满足只警告（语料覆盖不确定，不代表构建错误）
SOFT_CASES = [
    ("axes", "exists", None),
    ("bad", "mention", ["worse"]),
]


def shard_path(manifest, word):
    letter = word[0]
    key = word[:2] if letter in manifest.get("twoLetter", []) and len(word) > 1 else letter
    return SHARDS / manifest["version"] / f"{key}.json"


def main():
    manifest_file = ROOT / "corpus_manifest.json"
    if not manifest_file.exists():
        print("✗ 缺少 corpus_manifest.json，先运行 make shards", file=sys.stderr)
        return 1
    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
    if not manifest.get("hasLemma", False):
        print("✗ 当前分片构建时未开启词形还原（hasLemma=false），回归测试无意义", file=sys.stderr)
        return 1

    cache = {}
    print(f"分片版本：{manifest['version']}  两字母拆分：{'/'.join(manifest['twoLetter'])}\n")

    failures, warnings = [], []
    for word, kind, forms in CASES + SOFT_CASES:
        soft = (word, kind, forms) in SOFT_CASES
        path = shard_path(manifest, word)
        if not path.exists():
            msg = f"{word:<12} 分片文件缺失 {path.name}"
            (warnings if soft else failures).append(msg)
            print(f"  {'⚠' if soft else '✗'} {msg}")
            continue
        if path not in cache:
            cache[path] = json.loads(path.read_text(encoding="utf-8"))
        dict_ = cache[path]

        if kind == "exists":
            ok = word in dict_
            msg = f"{word:<12} 键存在性"
        else:  # mention
            sents = dict_.get(word, [])
            hits = [f for f in forms if any(f in s for s in sents)]
            ok = bool(hits)
            msg = f"{word:<12} 召回词形 {forms} → 命中 {hits or '无'}"
        if not ok:
            (warnings if soft else failures).append(msg)
        print(f"  {'✓' if ok else ('⚠' if soft else '✗')} {msg}")

    print(f"\n结果：{len(CASES) + len(SOFT_CASES) - len(failures) - len(warnings)} 通过，"
          f"{len(failures)} 失败，{len(warnings)} 软警告")
    if failures:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
