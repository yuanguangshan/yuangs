import re
import json
import opencc

def cn_to_int(cn_str):
    """简单的中文数字转阿拉伯数字辅助函数(用于卷号排序)"""
    cn_nums = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '百': 100, '〇': 0, '零': 0}
    # 这是一个简化版，仅用于排序参考，实际解析不需要严格转换
    return 0 

def get_category(vol_index):
    """根据卷序判断体例"""
    if 1 <= vol_index <= 12: return "本纪"
    if 13 <= vol_index <= 22: return "表"
    if 23 <= vol_index <= 30: return "书"
    if 31 <= vol_index <= 60: return "世家"
    if 61 <= vol_index <= 130: return "列传"
    return "其他"

def parse_shiji(file_path):
    chapters = []
    current_chapter = None
    vol_counter = 0
    
    # 初始化繁简转换器
    cc = opencc.OpenCC('t2s')  # 繁体转简体

    # 正则匹配标题行，例如：## 卷一‧五帝本紀第一
    # 你的文本中分隔符是 '‧'
    header_pattern = re.compile(r'^##\s*(卷.+?)‧(.+)$')

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            
            # 检查是否是标题行
            match = header_pattern.match(line)
            
            if match:
                # 如果已有当前章节，先保存
                if current_chapter:
                    chapters.append(current_chapter)
                
                vol_counter += 1
                vol_label = cc.convert(match.group(1))  # 卷一 (转简体)
                title = cc.convert(match.group(2))      # 五帝本紀第一 (转简体)
                
                current_chapter = {
                    "id": vol_counter,
                    "category": get_category(vol_counter),
                    "volume_label": vol_label,
                    "title": title,
                    "content": []  # 使用数组存储段落（简体）
                }
            # 跳过注释行和空行 (注意：标题行也是以#开头，所以必须先检查标题)
            elif not line or line.startswith('#'):
                continue
            else:
                # 如果是正文内容，且当前已经在某个章节内
                if current_chapter:
                    # 转换为简体中文并添加到内容
                    if line:
                        current_chapter['content'].append(cc.convert(line))

        # 添加最后一章
        if current_chapter:
            chapters.append(current_chapter)

    return chapters

# 执行转换
try:
    data = parse_shiji(r'/Users/ygs/ygs/yuangs/shici/shiji_raw.txt') # 确保文件名与你的源文件一致
    
    # 写入 JSON 文件
    with open('shiji_struct.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"成功转换 {len(data)} 篇章节，已保存为 shiji_struct.json")
    
except FileNotFoundError:
    print("错误：未找到源文件，请确认文件名。")
except Exception as e:
    print(f"发生错误: {e}")