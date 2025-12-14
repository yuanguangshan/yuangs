package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"music-player-go/services"
)

// GetCacheHandler handles getting a cached value
func GetCacheHandler(cacheService *services.CacheService) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.Param("key")
		if key == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing cache key parameter",
			})
			return
		}

		value, exists := cacheService.Get(key)
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Cache key not found or expired",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    value,
		})
	}
}

// SetCacheHandler handles setting a cached value
func SetCacheHandler(cacheService *services.CacheService) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.Param("key")
		if key == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing cache key parameter",
			})
			return
		}

		var req struct {
			Value      interface{} `json:"value"`
			ExpiryHours float64    `json:"expiryHours"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid request body",
			})
			return
		}

		if req.ExpiryHours <= 0 {
			req.ExpiryHours = 24 // Default to 24 hours
		}

		cacheService.Set(key, req.Value, req.ExpiryHours)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"key":     key,
		})
	}
}

// RemoveCacheHandler handles removing a cached value
func RemoveCacheHandler(cacheService *services.CacheService) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.Param("key")
		if key == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Missing cache key parameter",
			})
			return
		}

		cacheService.Remove(key)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"key":     key,
		})
	}
}

// ClearCacheHandler handles clearing all cached values
func ClearCacheHandler(cacheService *services.CacheService) gin.HandlerFunc {
	return func(c *gin.Context) {
		cacheService.Clear()
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Cache cleared",
		})
	}
}

// GetCacheInfoHandler handles getting cache information
func GetCacheInfoHandler(cacheService *services.CacheService) gin.HandlerFunc {
	return func(c *gin.Context) {
		size := cacheService.Size()
		keys := cacheService.GetAllKeys()
		
		c.JSON(http.StatusOK, gin.H{
			"size": size,
			"keys": keys,
		})
	}
}