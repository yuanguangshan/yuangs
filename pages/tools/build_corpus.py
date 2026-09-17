#!/usr/bin/env python3
"""把本地保存的《经济学人》HTML 文章拆分成句子，生成语料库 JSONL。

输出格式（每行一个 JSON）：{"id": 序号, "s": "句子文本"}
用法：python3 tools/build_corpus.py
"""
import html as htmllib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCES = [
    Path("/Users/ygs/ygs/其它/economist2"),
    Path("/Users/ygs/ygs/ygs/learning/economist"),
]
OUT = ROOT / "corpus" / "economist_sentences.jsonl"

MIN_LEN, MAX_LEN = 25, 320


class TextExtractor(HTMLParser):
    """只提取 <p> 标签内的文本，跳过 script/style。"""

    SKIP = {"script", "style", "noscript", "svg", "head"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self._skip_depth = 0
        self._in_p = False

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self._skip_depth += 1
        elif tag == "p":
            self._in_p = True

    def handle_endtag(self, tag):
        if tag in self.SKIP and self._skip_depth > 0:
            self._skip_depth -= 1
        elif tag == "p":
            self._in_p = False
            self.parts.append("\n")

    def handle_data(self, data):
        if self._in_p and self._skip_depth == 0:
            self.parts.append(data)


def extract_paragraphs(html_text):
    parser = TextExtractor()
    try:
        parser.feed(html_text)
    except Exception:
        return []
    return [t for t in "".join(parser.parts).split("\n") if t.strip()]


SENT_SPLIT = re.compile(r"(?<=[.!?][\"')\]])\s+(?=[A-Z\"'(])|(?<=[.!?])\s+(?=[A-Z\"'(])")
NOISE = re.compile(
    r"(Explore more|Subscribe|Sign up|Advertisement|Read more|"
    r"All rights reserved|Copyright|The Economist Group|"
    r"This site requires|Enable JavaScript|Cookie|Privacy [Pp]olicy|"
    r"Access provided|Reuse this content|The trust project)"
)


def clean(text):
    return re.sub(r"\s+", " ", text).strip()


def split_sentences(paragraph):
    out = []
    for sent in SENT_SPLIT.split(paragraph):
        sent = clean(sent)
        if MIN_LEN <= len(sent) <= MAX_LEN and not NOISE.search(sent):
            # 句子至少含 3 个英文单词
            words = re.findall(r"[A-Za-z][A-Za-z'-]+", sent)
            if len(words) >= 3:
                out.append(sent)
    return out


def main():
    files = []
    for src in SOURCES:
        if src.exists():
            files.extend(src.rglob("*.html"))
    print(f"发现 {len(files)} 个 HTML 文件", flush=True)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    seen = set()
    total = 0
    with OUT.open("w", encoding="utf-8") as f:
        for i, path in enumerate(files):
            try:
                html_text = path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            for para in extract_paragraphs(html_text):
                for sent in split_sentences(para):
                    key = sent.lower()
                    if key in seen:
                        continue
                    seen.add(key)
                    f.write(json.dumps({"id": total, "s": sent}, ensure_ascii=False) + "\n")
                    total += 1
            if (i + 1) % 2000 == 0:
                print(f"已处理 {i + 1}/{len(files)} 个文件，句子 {total} 条", flush=True)

    print(f"完成：共 {total} 条句子，输出到 {OUT}", flush=True)


if __name__ == "__main__":
    sys.exit(main())
