package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"music-player-go/handlers"
	"music-player-go/services"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Set Gin to release mode if not in debug mode
	if os.Getenv("DEBUG") != "true" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create a new Gin router
	r := gin.Default()

	// Setup CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Initialize services
	youtubeService := services.NewYouTubeMusicService()
	iTunesService := services.NewITunesService()
	lyricsService := services.NewLyricsService()
	cacheService := services.NewCacheService()
	favoritesService := services.NewFavoritesService()
	historyService := services.NewHistoryService()
	themeService := services.NewThemeService()

	// Setup routes
	setupRoutes(r, youtubeService, iTunesService, lyricsService, cacheService, favoritesService, historyService, themeService)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}

func setupRoutes(
	r *gin.Engine,
	youtubeService *services.YouTubeMusicService,
	iTunesService *services.ITunesService,
	lyricsService *services.LyricsService,
	cacheService *services.CacheService,
	favoritesService *services.FavoritesService,
	historyService *services.HistoryService,
	themeService *services.ThemeService,
) {
	// Static file serving
	r.Static("/assets", "./assets")
	r.StaticFile("/sw.js", "./assets/sw.js")
	r.StaticFile("/manifest.json", "./assets/manifest.json")
	r.StaticFile("/YouTubePlayerManager.js", "./assets/YouTubePlayerManager.js")
	
	// Serve the main index.html
	r.GET("/", func(c *gin.Context) {
		c.File("./assets/index.html")
	})

	// Music search API
	r.GET("/api/music/search/song", handlers.SearchSongHandler(iTunesService, youtubeService, cacheService))
	r.GET("/api/music/search/artist", handlers.SearchArtistHandler(youtubeService))

	// YouTube Music specific endpoints
	r.GET("/api/youtubeapi/search/song", handlers.SearchYouTubeSongHandler(youtubeService))
	r.GET("/api/youtubeapi/lyrics/:videoId", handlers.GetLyricsHandler(youtubeService, lyricsService))

	// Lyrics API
	r.GET("/api/lyrics", handlers.GetLyricsByArtistTitleHandler(lyricsService))

	// Favorites and history endpoints
	r.GET("/api/favorites", handlers.GetFavoritesHandler(favoritesService))
	r.POST("/api/favorites", handlers.AddFavoriteHandler(favoritesService))
	r.DELETE("/api/favorites/:trackId", handlers.RemoveFavoriteHandler(favoritesService))
	r.GET("/api/history", handlers.GetHistoryHandler(historyService))
	r.POST("/api/history", handlers.AddHistoryHandler(historyService))

	// Theme endpoints
	r.GET("/api/theme", handlers.GetThemeHandler(themeService))
	r.POST("/api/theme", handlers.SetThemeHandler(themeService))

	// Caching endpoints
	r.GET("/api/cache/:key", handlers.GetCacheHandler(cacheService))
	r.POST("/api/cache/:key", handlers.SetCacheHandler(cacheService))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})
}