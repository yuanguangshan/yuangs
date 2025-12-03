# YouTube Music API 服务

整合了 YouTube Music API 的 Python 服务模块，可直接用于 Flask 接口。

## 文件说明

- `youtube_service.py` - 核心服务模块
- `flask_example.py` - Flask 接口使用示例
- `youtubeapi.py`, `artist.py`, `lyrics.py` - 原始测试文件（可保留作为参考）

## 安装依赖

```bash
pip install ytmusicapi flask
```

## 使用方法

### 方式一：直接调用函数

```python
from youtube_service import search_song, get_lyrics, get_artist_info

# 搜索歌曲
result = search_song("周杰伦 晴天", limit=5)
print(result)

# 获取歌词
lyrics = get_lyrics("DYptgVvkVLQ")
print(lyrics)

# 获取艺术家信息
artist = get_artist_info("UCPC0L1d253x-KuMNwa05TpA")
print(artist)
```

### 方式二：在 Flask 中使用

```python
from flask import Flask, jsonify, request
from youtube_service import search_song, get_lyrics

app = Flask(__name__)

@app.route('/api/search')
def search():
    query = request.args.get('q')
    result = search_song(query)
    return jsonify(result)

@app.route('/api/lyrics/<video_id>')
def lyrics(video_id):
    result = get_lyrics(video_id)
    return jsonify(result)
```

## API 函数列表

### `search_song(query, limit=5)`
搜索歌曲

**参数：**
- `query` (str): 搜索关键词
- `limit` (int): 返回结果数量

**返回：**
```python
{
    'success': True,
    'data': [
        {
            'title': '晴天 - Sunny Day',
            'video_id': 'DYptgVvkVLQ',
            'artists': ['Jay Chou'],
            'album': 'Ye Hui Mei',
            'duration': '4:29',
            'thumbnails': [...]
        }
    ]
}
```

### `search_artist(query, limit=5)`
搜索艺术家

**返回：**
```python
{
    'success': True,
    'data': [
        {
            'name': 'Taylor Swift',
            'browse_id': 'UCPC0L1d253x-KuMNwa05TpA',
            'thumbnails': [...]
        }
    ]
}
```

### `get_artist_info(channel_id)`
获取艺术家详细信息

**返回：**
```python
{
    'success': True,
    'data': {
        'name': 'Taylor Swift',
        'description': '...',
        'subscribers': '62.7M',
        'top_songs': [...]
    }
}
```

### `get_lyrics(video_id)`
获取歌词

**返回：**
```python
{
    'success': True,
    'data': {
        'lyrics': '歌词内容...',
        'source': 'LyricFind'
    }
}
```

### `get_song_details(video_id)`
获取歌曲完整信息（包括歌词）

**返回：**
```python
{
    'success': True,
    'data': {
        'video_id': 'DYptgVvkVLQ',
        'title': '晴天',
        'artists': ['Jay Chou'],
        'album': 'Ye Hui Mei',
        'thumbnails': [...],
        'lyrics': {
            'text': '...',
            'source': 'LyricFind'
        }
    }
}
```

## Flask 示例接口

运行 `flask_example.py` 后，可访问以下接口：

- `GET /api/music/search/song?q=周杰伦&limit=5` - 搜索歌曲
- `GET /api/music/search/artist?q=Taylor Swift` - 搜索艺术家
- `GET /api/music/artist/<channel_id>` - 获取艺术家信息
- `GET /api/music/lyrics/<video_id>` - 获取歌词
- `GET /api/music/song/<video_id>` - 获取歌曲完整信息

## 错误处理

所有函数都会返回统一格式的响应：

**成功：**
```python
{'success': True, 'data': {...}}
```

**失败：**
```python
{'success': False, 'error': '错误信息'}
```
