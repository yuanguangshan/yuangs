"""
Flask 接口使用示例
"""
from flask import Flask, jsonify, request
from youtube_service import search_song, search_artist, get_artist_info, get_lyrics, get_song_details

app = Flask(__name__)


@app.route('/api/music/search/song', methods=['GET'])
def api_search_song():
    """搜索歌曲接口"""
    query = request.args.get('q', '')
    limit = request.args.get('limit', 5, type=int)
    
    if not query:
        return jsonify({'success': False, 'error': '缺少搜索关键词'}), 400
    
    result = search_song(query, limit)
    return jsonify(result)


@app.route('/api/music/search/artist', methods=['GET'])
def api_search_artist():
    """搜索艺术家接口"""
    query = request.args.get('q', '')
    limit = request.args.get('limit', 5, type=int)
    
    if not query:
        return jsonify({'success': False, 'error': '缺少搜索关键词'}), 400
    
    result = search_artist(query, limit)
    return jsonify(result)


@app.route('/api/music/artist/<channel_id>', methods=['GET'])
def api_get_artist(channel_id):
    """获取艺术家详细信息接口"""
    result = get_artist_info(channel_id)
    return jsonify(result)


@app.route('/api/music/lyrics/<video_id>', methods=['GET'])
def api_get_lyrics(video_id):
    """获取歌词接口"""
    result = get_lyrics(video_id)
    return jsonify(result)


@app.route('/api/music/song/<video_id>', methods=['GET'])
def api_get_song_details(video_id):
    """获取歌曲完整信息接口"""
    result = get_song_details(video_id)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
