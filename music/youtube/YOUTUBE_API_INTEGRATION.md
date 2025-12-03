# YouTube Music API 集成文档

已成功将 YouTube Music API 集成到你的 Flask 应用 `data_api.py` 中。

## 📋 新增接口列表

所有接口都以 `/youtubeapi` 为前缀，与你现有的 API 保持一致的命名风格。

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
├── data_api.py          # 你的主 Flask 应用（已更新）
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
{"success": false, "error": "错误描述"}
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
fetch('http://localhost:5000/youtubeapi/search/artist?q=Taylor Swift')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🔗 与现有 API 的集成

这些新接口与你现有的 API 完美集成：
- 使用相同的 Flask app 实例
- 遵循相同的 JSON 响应格式
- 使用相同的日志系统
- 支持 CORS（已配置）

你可以在前端统一调用，无需额外配置。
