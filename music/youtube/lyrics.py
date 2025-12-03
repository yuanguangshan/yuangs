from ytmusicapi import YTMusic

yt = YTMusic()
video_id = "DYptgVvkVLQ" # 假设这是某首歌的 videoId

# 1. 获取播放相关信息 (watch playlist)
watch_playlist = yt.get_watch_playlist(videoId=video_id)

# 2. 检查是否有歌词
if watch_playlist['lyrics']:
    lyrics_id = watch_playlist['lyrics']
    
    # 3. 获取具体歌词内容
    lyrics_data = yt.get_lyrics(lyrics_id)
    print(lyrics_data['lyrics'])
else:
    print("该歌曲没有提供歌词。")