#!/bin/bash

# 一言获取并发送到微信的脚本

# 设置API地址
HITOKOTO_API="https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=e&c=f&c=g&c=h&c=i&c=j&c=k"
WECHAT_API="https://api.yuangs.cc/weixinpush"

# 临时文件存储JSON响应
TEMP_JSON=$(mktemp)

# 获取一言数据
echo "正在获取一言..."
if ! curl -s -o "$TEMP_JSON" "$HITOKOTO_API"; then
    echo "❌ 获取一言失败：网络错误"
    rm -f "$TEMP_JSON"
    exit 1
fi

# 检查返回的数据是否有效
if ! jq -e .hitokoto "$TEMP_JSON" >/dev/null 2>&1; then
    echo "❌ 获取一言失败：数据格式错误"
    rm -f "$TEMP_JSON"
    exit 1
fi

# 提取一言内容和来源
CONTENT=$(jq -r .hitokoto "$TEMP_JSON")
FROM=$(jq -r '.from_who + "《" + .from + "》"' "$TEMP_JSON" 2>/dev/null)

# 如果没有from_who，则只使用from
if [[ "$FROM" == "null《"*.from*"》" ]] || [[ "$FROM" == "《"*.from*"》" ]]; then
    FROM=$(jq -r .from "$TEMP_JSON")
fi

# 构造完整内容（包含来源）
if [[ "$FROM" != "null" ]] && [[ -n "$FROM" ]]; then
    FULL_CONTENT="$CONTENT

—— $FROM"
else
    FULL_CONTENT="$CONTENT"
fi

echo "📖 今日一言："
echo "$FULL_CONTENT"

# 发送到微信接口
echo "正在发送到微信..."

# 构造POST数据
POST_DATA=$(jq -n \
    --arg title "一言" \
    --arg content "$FULL_CONTENT" \
    --arg to_user "@all" \
    '{
        msgtype: "text",
        title: $title,
        content: $content,
        to_user: $to_user
    }')

# 发送请求
if curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$POST_DATA" \
    "$WECHAT_API" >/dev/null; then
    echo "✅ 成功发送到微信"
else
    echo "❌ 发送到微信失败"
fi

# 清理临时文件
rm -f "$TEMP_JSON"