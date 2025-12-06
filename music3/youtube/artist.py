from ytmusicapi import YTMusic

yt = YTMusic()

# 你需要先通过 search 找到艺术家的 channelId
channel_id = "UCPC0L1d253x-KuMNwa05TpA" # 艺术家的 Channel ID
artist_info = yt.get_artist(channel_id)

print(f"艺术家: {artist_info['name']}")
print(f"描述: {artist_info['description']}")
print(f"订阅数: {artist_info['subscribers']}")

# 查看热门歌曲
for song in artist_info['songs']['results']:
    print(song['title'])