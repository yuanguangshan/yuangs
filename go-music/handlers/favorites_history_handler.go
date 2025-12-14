package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"music-player-go/services"
)

// GetFavoritesHandler handles getting favorites
func GetFavoritesHandler(favoritesService *services.FavoritesService) gin.HandlerFunc {
	return func(c *gin.Context) {
		favorites := favoritesService.GetAll()
		c.JSON(http.StatusOK, gin.H{
			"favorites": favorites,
		})
	}
}

// AddFavoriteHandler handles adding a favorite
func AddFavoriteHandler(favoritesService *services.FavoritesService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var song services.Favorite
		if err := c.ShouldBindJSON(&song); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid request body",
			})
			return
		}

		success := favoritesService.Add(song)
		if success {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
			})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Song already in favorites or invalid data",
			})
		}
	}
}

// RemoveFavoriteHandler handles removing a favorite
func RemoveFavoriteHandler(favoritesService *services.FavoritesService) gin.HandlerFunc {
	return func(c *gin.Context) {
		trackID := c.Param("trackId")
		if trackID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing track ID parameter",
			})
			return
		}

		success := favoritesService.Remove(trackID)
		if success {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
			})
		} else {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Favorite not found",
			})
		}
	}
}

// GetHistoryHandler handles getting history
func GetHistoryHandler(historyService *services.HistoryService) gin.HandlerFunc {
	return func(c *gin.Context) {
		history := historyService.GetAll()
		c.JSON(http.StatusOK, gin.H{
			"history": history,
		})
	}
}

// AddHistoryHandler handles adding to history
func AddHistoryHandler(historyService *services.HistoryService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var song services.HistoryItem
		if err := c.ShouldBindJSON(&song); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid request body",
			})
			return
		}

		historyService.Add(song)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
		})
	}
}

// RemoveHistoryHandler handles removing from history
func RemoveHistoryHandler(historyService *services.HistoryService) gin.HandlerFunc {
	return func(c *gin.Context) {
		trackID := c.Param("trackId")
		if trackID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing track ID parameter",
			})
			return
		}

		success := historyService.Remove(trackID)
		if success {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
			})
		} else {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "History item not found",
			})
		}
	}
}

// ClearHistoryHandler handles clearing history
func ClearHistoryHandler(historyService *services.HistoryService) gin.HandlerFunc {
	return func(c *gin.Context) {
		historyService.Clear()
		c.JSON(http.StatusOK, gin.H{
			"success": true,
		})
	}
}

// ClearFavoritesHandler handles clearing favorites
func ClearFavoritesHandler(favoritesService *services.FavoritesService) gin.HandlerFunc {
	return func(c *gin.Context) {
		favoritesService.Clear()
		c.JSON(http.StatusOK, gin.H{
			"success": true,
		})
	}
}

// ExportFavoritesHandler handles exporting favorites
func ExportFavoritesHandler(favoritesService *services.FavoritesService) gin.HandlerFunc {
	return func(c *gin.Context) {
		data, err := favoritesService.Export()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Failed to export favorites",
			})
			return
		}

		c.Data(http.StatusOK, "application/json", data)
	}
}

// ImportFavoritesHandler handles importing favorites
func ImportFavoritesHandler(favoritesService *services.FavoritesService) gin.HandlerFunc {
	return func(c *gin.Context) {
		file, _, err := c.Request.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "No file provided",
			})
			return
		}
		defer file.Close()

		// Read the file contents
		data := make([]byte, c.Request.ContentLength)
		_, err = file.Read(data)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Failed to read file",
			})
			return
		}

		err = favoritesService.Import(data)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid file format",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
		})
	}
}

// ExportHistoryHandler handles exporting history
func ExportHistoryHandler(historyService *services.HistoryService) gin.HandlerFunc {
	return func(c *gin.Context) {
		data, err := historyService.Export()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Failed to export history",
			})
			return
		}

		c.Data(http.StatusOK, "application/json", data)
	}
}

// ImportHistoryHandler handles importing history
func ImportHistoryHandler(historyService *services.HistoryService) gin.HandlerFunc {
	return func(c *gin.Context) {
		file, _, err := c.Request.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "No file provided",
			})
			return
		}
		defer file.Close()

		// Read the file contents
		data := make([]byte, c.Request.ContentLength)
		_, err = file.Read(data)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Failed to read file",
			})
			return
		}

		err = historyService.Import(data)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid file format",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
		})
	}
}