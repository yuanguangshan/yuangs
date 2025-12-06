# 此文件作为youtube服务已经到服务器供data_api使用

from ytmusicapi import YTMusic

class YouTubeMusicService:
    """YouTube Music API 服务类，用于 Flask 接口"""

    def __init__(self):
        self.yt = YTMusic()

    def _get_best_thumbnail(self, thumbnails):
        """
        从缩略图列表中选择最佳质量的缩略图

        Args:
            thumbnails (list): 缩略图列表，每个元素包含 url, width, height

        Returns:
            str: 最佳缩略图的 URL，如果列表为空则返回 None
        """
        if not thumbnails:
            return None

        # Sort by area (width * height) to choose the largest thumbnail
        # This should give us the highest resolution thumbnail available
        best_thumb = max(thumbnails, key=lambda x: x.get('width', 0) * x.get('height', 0))
        return best_thumb.get('url')
    
    def search_song(self, query, limit=5):
        """
        搜索歌曲

        Args:
            query (str): 搜索关键词
            limit (int): 返回结果数量限制

        Returns:
            list: 歌曲信息列表
        """
        try:
            results = self.yt.search(query, filter="songs", limit=limit)
            songs = []

            for item in results:
                video_id = item.get('videoId', '')
                # Select the highest quality thumbnail
                thumbnails = item.get('thumbnails', [])
                best_thumbnail = self._get_best_thumbnail(thumbnails)

                song_info = {
                    'title': item.get('title', ''),
                    'video_id': video_id,
                    'artists': [artist.get('name', '') for artist in item.get('artists', [])],
                    'album': item.get('album', {}).get('name', '') if item.get('album') else '',
                    'duration': item.get('duration', ''),
                    'thumbnails': thumbnails,
                    'thumbnail_url': best_thumbnail,  # Add URL for the best thumbnail
                    # 添加播放链接
                    'youtube_url': f'https://www.youtube.com/watch?v={video_id}',
                    'youtube_music_url': f'https://music.youtube.com/watch?v={video_id}',
                    'embed_url': f'https://www.youtube.com/embed/{video_id}'
                }
                songs.append(song_info)

            return {
                'success': True,
                'data': songs
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def search_artist(self, query, limit=5):
        """
        搜索艺术家
        
        Args:
            query (str): 艺术家名称
            limit (int): 返回结果数量限制
            
        Returns:
            dict: 艺术家信息列表
        """
        try:
            results = self.yt.search(query, filter="artists", limit=limit)
            artists = []
            
            for item in results:
                # Select the highest quality thumbnail
                thumbnails = item.get('thumbnails', [])
                best_thumbnail = self._get_best_thumbnail(thumbnails)

                artist_info = {
                    'name': item.get('artist', ''),
                    'browse_id': item.get('browseId', ''),
                    'thumbnails': thumbnails,
                    'thumbnail_url': best_thumbnail  # Add URL for the best thumbnail
                }
                artists.append(artist_info)

            return {
                'success': True,
                'data': artists
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_artist_info(self, channel_id):
        """
        获取艺术家详细信息

        Args:
            channel_id (str): 艺术家的 Channel ID / Browse ID

        Returns:
            dict: 艺术家详细信息
        """
        try:
            artist_info = self.yt.get_artist(channel_id)

            # 提取热门歌曲
            top_songs = []
            if artist_info.get('songs') and artist_info['songs'].get('results'):
                for song in artist_info['songs']['results'][:10]:  # 限制前10首
                    video_id = song.get('videoId', '')
                    # Select the highest quality thumbnail for the song
                    song_thumbnails = song.get('thumbnails', [])
                    best_song_thumbnail = self._get_best_thumbnail(song_thumbnails)

                    top_songs.append({
                        'title': song.get('title', ''),
                        'video_id': video_id,
                        'thumbnails': song_thumbnails,
                        'thumbnail_url': best_song_thumbnail,  # Add URL for the best thumbnail
                        # 添加播放链接
                        'youtube_url': f'https://www.youtube.com/watch?v={video_id}',
                        'youtube_music_url': f'https://music.youtube.com/watch?v={video_id}'
                    })

            # Select the highest quality thumbnail for the artist
            artist_thumbnails = artist_info.get('thumbnails', [])
            best_artist_thumbnail = self._get_best_thumbnail(artist_thumbnails)

            return {
                'success': True,
                'data': {
                    'name': artist_info.get('name', ''),
                    'description': artist_info.get('description', ''),
                    'subscribers': artist_info.get('subscribers', ''),
                    'thumbnails': artist_thumbnails,
                    'thumbnail_url': best_artist_thumbnail,  # Add URL for the best thumbnail
                    'top_songs': top_songs
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_lyrics(self, video_id):
        """
        获取歌词
        
        Args:
            video_id (str): 歌曲的 Video ID
            
        Returns:
            dict: 歌词信息
        """
        try:
            # 获取播放列表信息
            watch_playlist = self.yt.get_watch_playlist(videoId=video_id)
            
            # 检查是否有歌词
            if watch_playlist.get('lyrics'):
                lyrics_id = watch_playlist['lyrics']
                lyrics_data = self.yt.get_lyrics(lyrics_id)
                
                return {
                    'success': True,
                    'data': {
                        'lyrics': lyrics_data.get('lyrics', ''),
                        'source': lyrics_data.get('source', '')
                    }
                }
            else:
                return {
                    'success': False,
                    'error': '该歌曲没有提供歌词'
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_song_details(self, video_id):
        """
        获取歌曲完整信息（包括歌词）
        
        Args:
            video_id (str): 歌曲的 Video ID
            
        Returns:
            dict: 歌曲完整信息
        """
        try:
            # 获取播放列表信息
            watch_playlist = self.yt.get_watch_playlist(videoId=video_id)

            track_info = watch_playlist.get('tracks', [{}])[0]
            # Get thumbnails and select the best one
            thumbnails = track_info.get('thumbnail', [])
            best_thumbnail = self._get_best_thumbnail(thumbnails)

            song_info = {
                'video_id': video_id,
                'title': track_info.get('title', ''),
                'artists': [artist.get('name', '') for artist in track_info.get('artists', [])],
                'album': track_info.get('album', {}).get('name', ''),
                'thumbnails': thumbnails,
                'thumbnail_url': best_thumbnail,  # Add URL for the best thumbnail
                # 添加播放链接
                'youtube_url': f'https://www.youtube.com/watch?v={video_id}',
                'youtube_music_url': f'https://music.youtube.com/watch?v={video_id}',
                'embed_url': f'https://www.youtube.com/embed/{video_id}',
                'lyrics': None
            }
            
            # 尝试获取歌词
            if watch_playlist.get('lyrics'):
                lyrics_id = watch_playlist['lyrics']
                lyrics_data = self.yt.get_lyrics(lyrics_id)
                song_info['lyrics'] = {
                    'text': lyrics_data.get('lyrics', ''),
                    'source': lyrics_data.get('source', '')
                }
            
            return {
                'success': True,
                'data': song_info
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


# 便捷函数，用于直接在 Flask 路由中调用
_service = None

def get_youtube_service():
    """获取 YouTubeMusicService 单例"""
    global _service
    if _service is None:
        _service = YouTubeMusicService()
    return _service


# 导出的便捷函数
def search_song(query, limit=5):
    """搜索歌曲"""
    return get_youtube_service().search_song(query, limit)


def search_artist(query, limit=5):
    """搜索艺术家"""
    return get_youtube_service().search_artist(query, limit)


def get_artist_info(channel_id):
    """获取艺术家详细信息"""
    return get_youtube_service().get_artist_info(channel_id)


def get_lyrics(video_id):
    """获取歌词"""
    return get_youtube_service().get_lyrics(video_id)


def get_song_details(video_id):
    """获取歌曲完整信息"""
    return get_youtube_service().get_song_details(video_id)
