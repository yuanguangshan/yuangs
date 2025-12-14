# Go Music Player

A reimplementation of the original JavaScript/Python music player application in Go. This project provides a web-based music player with support for both iTunes and YouTube Music search, lyrics display, favorites, history, themes, and more.

## Features

- **Music Search**: Search for songs on iTunes and YouTube Music
- **Lyrics Display**: Shows lyrics for playing tracks
- **Favorites**: Save and manage your favorite songs
- **History**: Keep track of recently played songs
- **Themes**: Multiple theme options (Dark Green, Light, Ocean, Cyber, Sunset, Midnight, Forest, Retro)
- **YouTube Integration**: Play YouTube videos directly in the player
- **PWA Support**: Installable as a Progressive Web App
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

The application consists of:

- **Backend**: Go server using Gin framework
- **Frontend**: HTML/CSS/JavaScript (same as original but updated API endpoints)
- **Services**: Separate service modules for different functionalities

## Project Structure

```
go-music/                 # Go version directory
├── cmd/
│   └── server/
│       └── main.go      # Main server entry point
├── handlers/            # HTTP request handlers
├── services/            # Business logic services
├── models/              # Data models (if needed)
├── utils/               # Utility functions (if needed)
├── assets/              # Static assets (HTML, CSS, JS, images)
│   ├── index.html       # Main HTML file
│   ├── YouTubePlayerManager.js
│   ├── sw.js            # Service worker
│   ├── manifest.json    # PWA manifest
│   └── icon/            # Icon files
├── go.mod               # Go module file
└── README.md            # This file
```

## Services

- **YouTubeMusicService**: Handles YouTube Music functionality (with mock implementation)
- **ITunesService**: Handles iTunes API integration
- **LyricsService**: Retrieves lyrics for songs
- **CacheService**: In-memory caching functionality
- **FavoritesService**: Manages user's favorite songs
- **HistoryService**: Keeps track of play history
- **ThemeService**: Manages theme preferences

## API Endpoints

### Music Search
- `GET /api/music/search/song?q={query}&limit={limit}` - Search for songs
- `GET /api/youtubeapi/search/song?q={query}&limit={limit}` - Search YouTube songs

### Lyrics
- `GET /api/lyrics?artist={artist}&title={title}` - Get lyrics by artist/title
- `GET /api/youtubeapi/lyrics/{videoId}` - Get YouTube lyrics

### Favorites
- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add a favorite
- `DELETE /api/favorites/{trackId}` - Remove a favorite

### History
- `GET /api/history` - Get play history
- `POST /api/history` - Add to history

### Themes
- `GET /api/theme` - Get current theme
- `POST /api/theme` - Set theme

### Cache
- `GET /api/cache/{key}` - Get cached value
- `POST /api/cache/{key}` - Set cached value

## Setup and Running

1. **Prerequisites**:
   - Go 1.21 or higher

2. **Install Dependencies**:
   ```bash
   go mod tidy
   ```

3. **Run the Server**:
   ```bash
   go run cmd/server/main.go
   ```

4. **Access the Application**:
   Open your browser to `http://localhost:8080`

## Environment Variables

- `PORT` - Port to run the server on (default: 8080)
- `DEBUG` - Set to "true" for debug mode (default: false)

## Configuration

The application uses:
- Gin framework for HTTP routing
- CORS middleware for cross-origin requests
- JSON for API responses
- In-memory storage for favorites, history, and cache (file-based persistence)

## Differences from the Original

- Backend: Replaced Python Flask with Go Gin server
- API calls: Updated to use local Go endpoints instead of external services
- Caching: In-memory cache with file persistence
- All static assets are served from the `assets/` directory

## Future Enhancements

- Implement real YouTube Music API integration (currently uses mock data)
- Add database support for persistent storage
- Implement user authentication
- Add more music sources
- Real-time synchronization across devices

## License

This project follows the same licensing as the original, if any was specified.