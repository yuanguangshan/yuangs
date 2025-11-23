

#!/usr/bin/env bash
# 方案A：就地在 music.txt 末尾追加结果
# 用法: ./append_links.sh music.txt [country]
# 说明:
#   - 输入文件每行一个 trackId（纯数字）。脚本会跳过空行、URL行、非数字行。
#   - 查询 https://itunes.apple.com/lookup?id=...&country=...，
#     取 results[0].trackViewUrl（无则 collectionViewUrl）作为跳转链接。
#   - 将 "trackId<TAB>URL" 统一追加到原文件末尾。
# 依赖: curl, jq

set -euo pipefail

FILE="${1:-music.txt}"
COUNTRY="${2:-cn}"

if [[ ! -f "$FILE" ]]; then
  echo "文件不存在: $FILE" >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "未找到 curl，请先安装。" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "未找到 jq，请先安装（macOS 可用: brew install jq）。" >&2
  exit 1
fi

# 暂存输出，最后一次性附加到原文件
TMP_OUT="$(mktemp)"
trap 'rm -f "$TMP_OUT"' EXIT

# 读取原文件（保持原样），仅处理纯数字 ID 行
while IFS= read -r line || [[ -n "$line" ]]; do
  id="$(echo "$line" | tr -d ' \t\r')"

  # 跳过：空行、以 http 开头的行、非数字行
  if [[ -z "$id" ]] || [[ "$id" =~ ^https?:// ]] || ! [[ "$id" =~ ^[0-9]+$ ]]; then
    continue
  fi

  url="https://itunes.apple.com/lookup?id=${id}&country=${COUNTRY}"

  # 请求接口（带轻量重试与超时）
  json="$(curl -sS --retry 3 --retry-delay 1 --connect-timeout 5 --max-time 15 "$url" || true)"

  # 安全读取 resultCount
  count="$(echo "$json" | jq -r '.resultCount // 0' 2>/dev/null || echo 0)"

  if [[ "$count" -gt 0 ]]; then
    # 优先 trackViewUrl，兜底 collectionViewUrl
    trackUrl="$(echo "$json" | jq -r '.results[0].trackViewUrl // .results[0].collectionViewUrl // empty')"
    if [[ -n "$trackUrl" && "$trackUrl" != "null" ]]; then
      echo -e "${id}\t${trackUrl}" | tee -a "$TMP_OUT" >/dev/null
      echo "OK  ${id} -> ${trackUrl}"
    else
      echo -e "${id}\tNOT_FOUND" | tee -a "$TMP_OUT" >/dev/null
      echo "NO  ${id} -> NOT_FOUND（无 trackViewUrl/collectionViewUrl）"
    fi
  else
    echo -e "${id}\tNOT_FOUND" | tee -a "$TMP_OUT" >/dev/null
    echo "NO  ${id} -> NOT_FOUND（resultCount=0）"
  fi
done < "$FILE"

# 将结果一次性追加到源文件末尾（与原有 ID 列表隔开一空行）
if [[ -s "$TMP_OUT" ]]; then
  echo "" >> "$FILE"
  cat "$TMP_OUT" >> "$FILE"
  echo "已追加到文件末尾：$FILE"
else
  echo "无可追加结果（可能没有符合条件的 ID 行）。"
fi
