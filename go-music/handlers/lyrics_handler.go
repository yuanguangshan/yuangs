package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"music-player-go/services"
)

// GetLyricsHandler handles lyrics requests
func GetLyricsHandler(youtubeService *services.YouTubeMusicService, lyricsService *services.LyricsService) gin.HandlerFunc {
	return func(c *gin.Context) {
		videoID := c.Param("videoId")
		if videoID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing video ID parameter",
			})
			return
		}

		// First try to get lyrics from YouTube Music
		result, err := youtubeService.GetLyrics(videoID)
		if err != nil || !result.Success {
			// If YouTube doesn't have lyrics, we could try alternative sources
			// For now, return a generic response
			c.JSON(http.StatusOK, services.SearchResponse{
				Success: false,
				Error:   "No lyrics found",
			})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

// GetSongDetailsHandler handles song details requests
func GetSongDetailsHandler(youtubeService *services.YouTubeMusicService) gin.HandlerFunc {
	return func(c *gin.Context) {
		videoID := c.Param("videoId")
		if videoID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing video ID parameter",
			})
			return
		}

		result, err := youtubeService.GetSongDetails(videoID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

// GetLyricsByArtistTitleHandler handles lyrics requests by artist and title
func GetLyricsByArtistTitleHandler(lyricsService *services.LyricsService) gin.HandlerFunc {
	return func(c *gin.Context) {
		artist := c.Query("artist")
		title := c.Query("title")

		if artist == "" || title == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing artist or title parameter",
			})
			return
		}

		lyrics, err := lyricsService.GetLyrics(artist, title)
		if err != nil {
			// Return empty lyrics instead of error, to match frontend fallback behavior
			c.JSON(http.StatusOK, gin.H{
				"lyrics": "",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"lyrics": lyrics,
		})
	}
}

// GetArtistInfoHandler handles artist info requests
func GetArtistInfoHandler(youtubeService *services.YouTubeMusicService) gin.HandlerFunc {
	return func(c *gin.Context) {
		channelID := c.Param("channelId")
		if channelID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing channel ID parameter",
			})
			return
		}

		result, err := youtubeService.GetArtistInfo(channelID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}