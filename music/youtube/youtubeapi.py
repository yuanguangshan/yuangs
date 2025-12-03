from ytmusicapi import YTMusic

yt = YTMusic()

# 搜索关键词
query = "周杰伦 晴天"
results = yt.search(query)

# 打印第一个结果的信息
if results:
    first_song = results[0]
    print(f"歌名: {first_song['title']}")
    print(f"Video ID: {first_song['videoId']}") # 这个 ID 很重要，后续操作都用它
    print(f"艺术家: {first_song['artists'][0]['name']}")
    # print(f"专辑: {first_song['album']['name']}")

# 专门搜索特定类型 (songs, videos, albums, artists, playlists)
artist_results = yt.search("Taylor Swift", filter="artists")
print(artist_results)