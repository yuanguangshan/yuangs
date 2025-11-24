#!/usr/bin/env python3
# extract_author_data.py - 提取作者数据

import re

# 读取原文件
with open('shici.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到 AUTHOR_DATA 的起始和结束位置
start_marker = 'window.AUTHOR_DATA = ['
end_marker = '];'

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Error: Could not find AUTHOR_DATA start")
    exit(1)

# 从起始位置开始查找结束标记
search_start = start_idx + len(start_marker)
end_idx = -1

# 查找匹配的结束标记（需要正确匹配括号）
bracket_count = 1
i = search_start
while i < len(content) and bracket_count > 0:
    if content[i] == '[':
        bracket_count += 1
    elif content[i] == ']':
        bracket_count -= 1
    i += 1

if bracket_count == 0:
    end_idx = i - 1  # 指向最后的']'
else:
    print("Error: Could not find matching bracket")
    exit(1)

# 提取数据
author_data_content = content[start_idx + len(start_marker):end_idx]

# 构建ES6模块
output = f"""// author-data.js - 作者数据模块
// 自动从 shici.html 提取

export const AUTHOR_DATA = [
{author_data_content}
];

// Helper function to get dynasty by author name
export function getDynastyByAuthorName(authorName) {{
    if (!AUTHOR_DATA) return '未知';
    const author = AUTHOR_DATA.find(a => a.name === authorName);
    return author ? author.dynasty : '未知';
}}
"""

# 写入文件
with open('shici-app/assets/js/author-data.js', 'w', encoding='utf-8') as f:
    f.write(output)

print("Author data extracted successfully!")
print(f"Extracted {len(author_data_content)} characters")
