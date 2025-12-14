package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"music-player-go/services"
)

// GetThemeHandler handles getting the current theme
func GetThemeHandler(themeService *services.ThemeService) gin.HandlerFunc {
	return func(c *gin.Context) {
		currentTheme := themeService.Get()
		allThemes := themeService.GetAll()
		
		c.JSON(http.StatusOK, gin.H{
			"currentTheme": currentTheme,
			"themes":       allThemes,
		})
	}
}

// SetThemeHandler handles setting the current theme
func SetThemeHandler(themeService *services.ThemeService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Theme string `json:"theme"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid request body",
			})
			return
		}

		if req.Theme == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Theme name is required",
			})
			return
		}

		success := themeService.Set(req.Theme)
		if success {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"theme":   req.Theme,
			})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid theme name",
			})
		}
	}
}

// GetAllThemesHandler handles getting all available themes
func GetAllThemesHandler(themeService *services.ThemeService) gin.HandlerFunc {
	return func(c *gin.Context) {
		themes := themeService.GetAll()
		c.JSON(http.StatusOK, gin.H{
			"themes": themes,
		})
	}
}

// AddThemeHandler handles adding a new theme
func AddThemeHandler(themeService *services.ThemeService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var theme services.Theme
		if err := c.ShouldBindJSON(&theme); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid request body",
			})
			return
		}

		if theme.Name == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Theme name is required",
			})
			return
		}

		themeService.Add(theme.Name, theme)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"theme":   theme.Name,
		})
	}
}