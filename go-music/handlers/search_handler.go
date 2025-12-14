package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"music-player-go/services"
)

// SearchSongHandler handles song search requests
func SearchSongHandler(iTunesService *services.ITunesService, youtubeService *services.YouTubeMusicService, cacheService *services.CacheService) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing search query parameter 'q'",
			})
			return
		}

		limitStr := c.Query("limit")
		limit := 48 // default
		if limitStr != "" {
			if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
				limit = parsedLimit
			}
		}

		// Check URL parameters to determine source
		isAppleOnly := c.Query("apple") == "true" && c.Query("youtube") != "true"
		isYouTubeOnly := c.Query("youtube") == "true" && c.Query("apple") != "true"
		_ = !isAppleOnly && !isYouTubeOnly // default case, not used directly

		var iTunesResults []services.ITunesResult
		var youTubeResults []services.YouTubeSong

		// Use cached results if available
		cacheKey := "search_" + query
		if cached, found := cacheService.Get(cacheKey); found {
			_ = cached // We'll process cached results later
		}

		if !isYouTubeOnly {
			// Search iTunes API
			iTunesResp, err := iTunesService.Search(query, 48)
			if err != nil {
				// Log error but continue with empty results
				iTunesResults = []services.ITunesResult{}
			} else {
				iTunesResults = iTunesResp.Results
			}
		}

		if !isAppleOnly {
			// Search YouTube Music API
			youtubeResp, err := youtubeService.SearchSong(query, 48)
			if err != nil || !youtubeResp.Success {
				// Log error but continue with empty results
				youTubeResults = []services.YouTubeSong{}
			} else {
				// More robustly convert interface{} to []YouTubeSong
				jsonData, err := json.Marshal(youtubeResp.Data)
				if err != nil {
					youTubeResults = []services.YouTubeSong{}
				} else {
					var songs []services.YouTubeSong
					if err := json.Unmarshal(jsonData, &songs); err != nil {
						youTubeResults = []services.YouTubeSong{}
					} else {
						youTubeResults = songs
					}
				}
			}
		}

		// Apply limits based on URL parameters
		if isAppleOnly {
			iTunesResults = limitITunesResults(iTunesResults, limit)
			youTubeResults = []services.YouTubeSong{}
		} else if isYouTubeOnly {
			youTubeResults = limitYouTubeResults(youTubeResults, limit)
			iTunesResults = []services.ITunesResult{}
		} else {
			// Default case: each source up to half of limit
			halfLimit := limit / 2
			iTunesResults = limitITunesResults(iTunesResults, halfLimit)
			youTubeResults = limitYouTubeResults(youTubeResults, halfLimit)
		}

		// Prepare the response in iTunes format for compatibility
		var allResults []map[string]interface{}

		// Convert iTunes results to the expected format
		for _, result := range iTunesResults {
			allResults = append(allResults, map[string]interface{}{
				"artistName":      result.ArtistName,
				"trackName":       result.TrackName,
				"trackId":         result.TrackID,
				"collectionName":  result.CollectionName,
				"artworkUrl100":   strings.Replace(result.ArtworkURL100, "100x100bb", "300x300bb", -1),
				"previewUrl":      result.PreviewURL,
				"kind":            result.Kind,
				"primaryGenreName": result.Genre,
				"releaseDate":     result.ReleaseDate,
				"collectionId":    result.CollectionID,
				"trackTimeMillis": result.TrackTimeMillis,
			})
		}

		// Convert YouTube results to the expected iTunes format
		for _, result := range youTubeResults {
			allResults = append(allResults, map[string]interface{}{
				"artistName":      strings.Join(result.Artists, ", "),
				"trackName":       result.Title,
				"trackId":         result.VideoID,
				"collectionName":  "YouTube Music",
				"artworkUrl100":   result.ThumbnailURL,
				"previewUrl":      result.YouTubeURL,
				"kind":            "youtube",
				"primaryGenreName": result.Album,
				"releaseDate":     "",
				"collectionId":    0,
				"trackTimeMillis": services.ParseDurationString(result.Duration),
				"duration":        result.Duration,
			})
		}

		// Cache the results
		cacheData := map[string]interface{}{
			"itunes":  iTunesResults,
			"youtube": youTubeResults,
		}
		cacheService.Set(cacheKey, cacheData, 1) // Cache for 1 hour

		c.JSON(http.StatusOK, gin.H{
			"resultCount": len(allResults),
			"results":     allResults,
		})
	}
}

// limitITunesResults limits the iTunes results slice to the specified number
func limitITunesResults(results []services.ITunesResult, limit int) []services.ITunesResult {
	if len(results) > limit {
		return results[:limit]
	}
	return results
}

// limitYouTubeResults limits the YouTube results slice to the specified number
func limitYouTubeResults(results []services.YouTubeSong, limit int) []services.YouTubeSong {
	if len(results) > limit {
		return results[:limit]
	}
	return results
}

// SearchYouTubeSongHandler handles YouTube song search requests only
func SearchYouTubeSongHandler(youtubeService *services.YouTubeMusicService) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing search query parameter 'q'",
			})
			return
		}

		limitStr := c.Query("limit")
		limit := 48 // default
		if limitStr != "" {
			if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
				limit = parsedLimit
			}
		}

		// Search YouTube Music API directly
		youtubeResp, err := youtubeService.SearchSong(query, limit)
		if err != nil || !youtubeResp.Success {
			// Return empty results if YouTube search fails
			c.JSON(http.StatusOK, gin.H{
				"resultCount": 0,
				"results":     []interface{}{},
			})
			return
		}

		// Convert YouTube results to the expected format
		var results []map[string]interface{}
		var youtubeSongs []services.YouTubeSong

		// More robustly convert interface{} to []YouTubeSong
		jsonData, err := json.Marshal(youtubeResp.Data)
		if err != nil {
			youtubeSongs = []services.YouTubeSong{}
		} else {
			if err := json.Unmarshal(jsonData, &youtubeSongs); err != nil {
				youtubeSongs = []services.YouTubeSong{}
			}
		}

		for _, result := range youtubeSongs {
			results = append(results, map[string]interface{}{
				"artistName":       strings.Join(result.Artists, ", "),
				"trackName":        result.Title,
				"trackId":          result.VideoID,
				"collectionName":   "YouTube Music",
				"artworkUrl100":    result.ThumbnailURL,
				"previewUrl":       result.YouTubeURL,
				"kind":             "youtube",
				"primaryGenreName": result.Album,
				"releaseDate":      "",
				"collectionId":     0,
				"trackTimeMillis":  services.ParseDurationString(result.Duration),
				"duration":         result.Duration,
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"resultCount": len(results),
			"results":     results,
		})
	}
}

// SearchArtistHandler handles artist search requests
func SearchArtistHandler(youtubeService *services.YouTubeMusicService) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing search query parameter 'q'",
			})
			return
		}

		limitStr := c.Query("limit")
		limit := 5 // default
		if limitStr != "" {
			if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
				limit = parsedLimit
			}
		}

		result, err := youtubeService.SearchArtist(query, limit)
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