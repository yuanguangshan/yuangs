package services

import (
	"encoding/json"
	"os"
	"sync"
)

// Theme represents a theme configuration
type Theme struct {
	Name string `json:"name"`
	// Add more theme properties as needed
	Primary   string `json:"primary,omitempty"`
	PrimaryDark string `json:"primaryDark,omitempty"`
	Accent    string `json:"accent,omitempty"`
	Background string `json:"background,omitempty"`
	Text      string `json:"text,omitempty"`
	TextSecondary string `json:"textSecondary,omitempty"`
	Card      string `json:"card,omitempty"`
	CardHover string `json:"cardHover,omitempty"`
	Glass     string `json:"glass,omitempty"`
	GlassBorder string `json:"glassBorder,omitempty"`
	PlayerBG  string `json:"playerBg,omitempty"`
	HeaderBG  string `json:"headerBg,omitempty"`
}

// ThemeService handles theme management
type ThemeService struct {
	currentTheme string
	themes       map[string]Theme
	mu           sync.RWMutex
	filename     string
}

// NewThemeService creates a new ThemeService
func NewThemeService() *ThemeService {
	service := &ThemeService{
		currentTheme: "default", // Default theme
		themes:       make(map[string]Theme),
		filename:     "themes.json",
	}
	
	// Initialize with default themes
	service.initializeDefaultThemes()
	
	// Load existing themes from file
	service.loadFromFile()
	
	return service
}

// Get retrieves the current theme
func (t *ThemeService) Get() string {
	t.mu.RLock()
	defer t.mu.RUnlock()
	
	return t.currentTheme
}

// Set sets the current theme
func (t *ThemeService) Set(themeName string) bool {
	t.mu.Lock()
	defer t.mu.Unlock()
	
	// Check if the theme exists
	if _, exists := t.themes[themeName]; !exists {
		return false
	}
	
	t.currentTheme = themeName
	
	// Save to file
	t.saveToFile()
	
	return true
}

// GetAll returns all available themes
func (t *ThemeService) GetAll() map[string]Theme {
	t.mu.RLock()
	defer t.mu.RUnlock()
	
	// Create a copy to prevent race conditions
	result := make(map[string]Theme, len(t.themes))
	for k, v := range t.themes {
		result[k] = v
	}
	
	return result
}

// Add adds a new theme
func (t *ThemeService) Add(themeName string, theme Theme) {
	t.mu.Lock()
	defer t.mu.Unlock()
	
	t.themes[themeName] = theme
	
	// Save to file
	t.saveToFile()
}

// Remove removes a theme
func (t *ThemeService) Remove(themeName string) bool {
	t.mu.Lock()
	defer t.mu.Unlock()
	
	// Don't allow removing the current theme if it's the only one
	if themeName == t.currentTheme && len(t.themes) <= 1 {
		return false
	}
	
	delete(t.themes, themeName)
	
	// If the current theme was removed, set to default
	if themeName == t.currentTheme {
		t.currentTheme = "default"
	}
	
	// Save to file
	t.saveToFile()
	
	return true
}

// GetThemeDetails returns the details of a specific theme
func (t *ThemeService) GetThemeDetails(themeName string) *Theme {
	t.mu.RLock()
	defer t.mu.RUnlock()
	
	if theme, exists := t.themes[themeName]; exists {
		return &theme
	}
	
	return nil
}

// saveToFile saves themes to a JSON file
func (t *ThemeService) saveToFile() {
	data := struct {
		CurrentTheme string           `json:"currentTheme"`
		Themes       map[string]Theme `json:"themes"`
	}{
		CurrentTheme: t.currentTheme,
		Themes:       t.themes,
	}
	
	file, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		// Log the error or handle it appropriately
		return
	}
	
	if err := os.WriteFile(t.filename, file, 0644); err != nil {
		// Log the error or handle it appropriately
		return
	}
}

// loadFromFile loads themes from a JSON file
func (t *ThemeService) loadFromFile() {
	file, err := os.ReadFile(t.filename)
	if err != nil {
		// If file doesn't exist, that's okay - we'll use defaults
		return
	}
	
	var data struct {
		CurrentTheme string           `json:"currentTheme"`
		Themes       map[string]Theme `json:"themes"`
	}
	
	if err := json.Unmarshal(file, &data); err != nil {
		// If JSON is invalid, use defaults
		return
	}
	
	if data.CurrentTheme != "" {
		t.currentTheme = data.CurrentTheme
	}
	
	if len(data.Themes) > 0 {
		t.themes = data.Themes
	}
}

// initializeDefaultThemes initializes the service with default themes
func (t *ThemeService) initializeDefaultThemes() {
	// Define default themes that match the original HTML/CSS themes
	defaultThemes := map[string]Theme{
		"default": {
			Name:          "default",
			Primary:       "#1db954",
			PrimaryDark:   "#1aa34a",
			Accent:        "#ff6b6b",
			Background:    "#0a0a0a",
			Text:          "#ffffff",
			TextSecondary: "#a0a0a0",
			Card:          "#161616",
			CardHover:     "#1f1f1f",
			Glass:         "rgba(255, 255, 255, 0.08)",
			GlassBorder:   "rgba(255, 255, 255, 0.1)",
			PlayerBG:      "rgba(10, 10, 10, 0.95)",
			HeaderBG:      "rgba(10, 10, 10, 0.8)",
		},
		"light": {
			Name:          "light",
			Primary:       "#fa233b",
			PrimaryDark:   "#d61e32",
			Accent:        "#5e5ce6",
			Background:    "#f2f2f7",
			Text:          "#1d1d1f",
			TextSecondary: "#86868b",
			Card:          "#ffffff",
			CardHover:     "#f9f9f9",
			Glass:         "rgba(255, 255, 255, 0.75)",
			GlassBorder:   "rgba(0, 0, 0, 0.05)",
			PlayerBG:      "rgba(255, 255, 255, 0.9)",
			HeaderBG:      "rgba(242, 242, 247, 0.8)",
		},
		"ocean": {
			Name:          "ocean",
			Primary:       "#00d2ff",
			PrimaryDark:   "#00a8cc",
			Accent:        "#3a7bd5",
			Background:    "#0f172a",
			Text:          "#f8fafc",
			TextSecondary: "#94a3b8",
			Card:          "#1e293b",
			CardHover:     "#334155",
			Glass:         "rgba(255, 255, 255, 0.05)",
			GlassBorder:   "rgba(255, 255, 255, 0.08)",
			PlayerBG:      "rgba(15, 23, 42, 0.95)",
			HeaderBG:      "rgba(15, 23, 42, 0.8)",
		},
		"cyber": {
			Name:          "cyber",
			Primary:       "#d946ef",
			PrimaryDark:   "#c026d3",
			Accent:        "#22d3ee",
			Background:    "#120b18",
			Text:          "#fae8ff",
			TextSecondary: "#d8b4fe",
			Card:          "#271a33",
			CardHover:     "#362247",
			Glass:         "rgba(217, 70, 239, 0.1)",
			GlassBorder:   "rgba(217, 70, 239, 0.2)",
			PlayerBG:      "rgba(18, 11, 24, 0.95)",
			HeaderBG:      "rgba(18, 11, 24, 0.8)",
		},
		"sunset": {
			Name:          "sunset",
			Primary:       "#ff6b35",
			PrimaryDark:   "#e85d2a",
			Accent:        "#ff9f1c",
			Background:    "#1a0b08",
			Text:          "#fff5f2",
			TextSecondary: "#dcbab4",
			Card:          "#2d140f",
			CardHover:     "#3d1c15",
			Glass:         "rgba(255, 107, 53, 0.08)",
			GlassBorder:   "rgba(255, 107, 53, 0.15)",
			PlayerBG:      "rgba(26, 11, 8, 0.95)",
			HeaderBG:      "rgba(26, 11, 8, 0.8)",
		},
		"midnight": {
			Name:          "midnight",
			Primary:       "#ffffff",
			PrimaryDark:   "#e0e0e0",
			Accent:        "#ffd700",
			Background:    "#000000",
			Text:          "#ffffff",
			TextSecondary: "#888888",
			Card:          "#111111",
			CardHover:     "#222222",
			Glass:         "rgba(255, 255, 255, 0.05)",
			GlassBorder:   "rgba(255, 255, 255, 0.1)",
			PlayerBG:      "rgba(0, 0, 0, 0.95)",
			HeaderBG:      "rgba(0, 0, 0, 0.8)",
		},
		"forest": {
			Name:          "forest",
			Primary:       "#4ade80",
			PrimaryDark:   "#22c55e",
			Accent:        "#a3e635",
			Background:    "#052e16",
			Text:          "#f0fdf4",
			TextSecondary: "#86efac",
			Card:          "#064e3b",
			CardHover:     "#065f46",
			Glass:         "rgba(74, 222, 128, 0.05)",
			GlassBorder:   "rgba(74, 222, 128, 0.1)",
			PlayerBG:      "rgba(5, 46, 22, 0.95)",
			HeaderBG:      "rgba(5, 46, 22, 0.8)",
		},
		"retro": {
			Name:          "retro",
			Primary:       "#d4af37",
			PrimaryDark:   "#aa8c2c",
			Accent:        "#c5a028",
			Background:    "#2c241b",
			Text:          "#e8dcc5",
			TextSecondary: "#a89f91",
			Card:          "#3e3226",
			CardHover:     "#4e4033",
			Glass:         "rgba(212, 175, 55, 0.08)",
			GlassBorder:   "rgba(212, 175, 55, 0.15)",
			PlayerBG:      "rgba(44, 36, 27, 0.95)",
			HeaderBG:      "rgba(44, 36, 27, 0.8)",
		},
	}
	
	for name, theme := range defaultThemes {
		t.themes[name] = theme
	}
}