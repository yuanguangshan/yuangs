# YouTube Music API 服务

整合了 YouTube Music API 的 Python 服务模块，可直接用于 Flask 接口。

## 文件说明

- `youtube_service.py` - 核心服务模块
- `data_api.py` - Flask 主应用（已集成 YouTube Music API）
- `flask_example.py` - Flask 接口使用示例
- `youtubeapi.py`, `artist.py`, `lyrics.py` - 原始测试文件（可保留作为参考）

## 安装依赖

```bash
pip install ytmusicapi flask
```

---

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

---

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

---

## 📋 Flask API 接口列表

所有接口都以 `/youtubeapi` 为前缀，与现有的 API 保持一致的命名风格。

### 1. 搜索歌曲

**接口**: `GET /youtubeapi/search/song`

**参数**:

- `q` (必需): 搜索关键词
- `limit` (可选): 返回结果数量，默认 5，范围 1-50

**示例**:

```bash
curl "http://your-server.com/youtubeapi/search/song?q=周杰伦%20晴天&limit=5"
```

**返回格式**:

```json
{
  "success": true,
  "data": [
    {
      "title": "晴天 - Sunny Day",
      "video_id": "DYptgVvkVLQ",
      "artists": ["Jay Chou"],
      "album": "Ye Hui Mei",
      "duration": "4:29",
      "thumbnails": [...]
    }
  ]
}
```

---

### 2. 搜索艺术家

**接口**: `GET /youtubeapi/search/artist`

**参数**:

- `q` (必需): 艺术家名称
- `limit` (可选): 返回结果数量，默认 5，范围 1-50

**示例**:

```bash
curl "http://your-server.com/youtubeapi/search/artist?q=Taylor%20Swift"
```

**返回格式**:

```json
{
  "success": true,
  "data": [
    {
      "name": "Taylor Swift",
      "browse_id": "UCPC0L1d253x-KuMNwa05TpA",
      "thumbnails": [...]
    }
  ]
}
```

---

### 3. 获取艺术家详细信息

**接口**: `GET /youtubeapi/artist/<channel_id>`

**路径参数**:

- `channel_id`: 艺术家的 Channel ID / Browse ID

**示例**:

```bash
curl "http://your-server.com/youtubeapi/artist/UCPC0L1d253x-KuMNwa05TpA"
```

**返回格式**:

```json
{
  "success": true,
  "data": {
    "name": "Taylor Swift",
    "description": "...",
    "subscribers": "62.7M",
    "thumbnails": [...],
    "top_songs": [
      {
        "title": "Blank Space",
        "video_id": "e-ORhEE9VVg",
        "thumbnails": [...]
      }
    ]
  }
}
```

---

### 4. 获取歌词

**接口**: `GET /youtubeapi/lyrics/<video_id>`

**路径参数**:

- `video_id`: 歌曲的 Video ID

**示例**:

```bash
curl "http://your-server.com/youtubeapi/lyrics/DYptgVvkVLQ"
```

**返回格式**:

```json
{
  "success": true,
  "data": {
    "lyrics": "歌词内容...",
    "source": "LyricFind"
  }
}
```

**注意**: 如果歌曲没有歌词，返回:

```json
{
  "success": false,
  "error": "该歌曲没有提供歌词"
}
```

---

### 5. 获取歌曲完整信息

**接口**: `GET /youtubeapi/song/<video_id>`

**路径参数**:

- `video_id`: 歌曲的 Video ID

**示例**:

```bash
curl "http://your-server.com/youtubeapi/song/DYptgVvkVLQ"
```

**返回格式**:

```json
{
  "success": true,
  "data": {
    "video_id": "DYptgVvkVLQ",
    "title": "晴天",
    "artists": ["Jay Chou"],
    "album": "Ye Hui Mei",
    "thumbnails": [...],
    "lyrics": {
      "text": "...",
      "source": "LyricFind"
    }
  }
}
```

---

## 🔧 部署说明

### 1. 确保依赖已安装

```bash
pip install ytmusicapi
```

### 2. 文件结构

确保以下文件在同一目录：

```
music/youtube/
├── data_api.py          # 主 Flask 应用（已集成 YouTube Music API）
├── youtube_service.py   # YouTube Music 服务模块
└── ...
```

### 3. 启动服务

```bash
python data_api.py
```

启动时会看到日志：

- ✅ `YouTube Music 服务已加载` - 表示集成成功
- ⚠️ `YouTube Music 服务不可用` - 表示 `youtube_service.py` 未找到

---

## 🛡️ 错误处理

所有接口都遵循统一的错误格式：

**成功响应**:

```json
{"success": true, "data": {...}}
```

**失败响应**:

```json
{ "success": false, "error": "错误描述" }
```

**HTTP 状态码**:

- `200` - 成功
- `400` - 请求参数错误
- `500` - 服务器内部错误
- `503` - YouTube Music 服务不可用

---

## 📊 日志记录

所有接口都使用了 `@log_execution_time` 装饰器，会自动记录：

- 接口调用时间
- 执行耗时
- 错误堆栈（如果发生）

日志会写入 `data_api.log` 文件。

---

## 🧪 测试示例

### Python 测试

```python
import requests

# 搜索歌曲
response = requests.get('http://localhost:5000/youtubeapi/search/song',
                       params={'q': '周杰伦 晴天', 'limit': 3})
print(response.json())

# 获取歌词
response = requests.get('http://localhost:5000/youtubeapi/lyrics/DYptgVvkVLQ')
print(response.json())
```

### JavaScript 测试

```javascript
// 搜索艺术家
fetch("http://localhost:5000/youtubeapi/search/artist?q=Taylor Swift")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 🔗 与现有 API 的集成

这些新接口与现有的 API 完美集成：

- 使用相同的 Flask app 实例
- 遵循相同的 JSON 响应格式
- 使用相同的日志系统
- 支持 CORS（已配置）

你可以在前端统一调用，无需额外配置。

---

## 📝 测试输出示例

### 搜索歌曲测试

```
歌名: 晴天 - Sunny Day
Video ID: DYptgVvkVLQ
艺术家: Jay Chou
```

### 搜索艺术家测试

```
艺术家: Taylor Swift
描述: And, baby, that's show business for you. New album The Life of a Showgirl. Out October 3  ❤️‍🔥
订阅数: 62.7M
 
热门歌曲:
- The Fate of Ophelia
- Opalite
- Blank Space
- Shake It Off
- Cruel Summer
```

---

## Flask 示例接口

运行 `flask_example.py` 后，可访问以下接口：

- `GET /api/music/search/song?q=周杰伦&limit=5` - 搜索歌曲
- `GET /api/music/search/artist?q=Taylor Swift` - 搜索艺术家
- `GET /api/music/artist/<channel_id>` - 获取艺术家信息
- `GET /api/music/lyrics/<video_id>` - 获取歌词
- `GET /api/music/song/<video_id>` - 获取歌曲完整信息
