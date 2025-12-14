package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// LyricsService handles lyrics retrieval
type LyricsService struct {
	client *http.Client
}

// LyricsResponse represents the lyrics API response
type LyricsResponse struct {
	Lyrics string `json:"lyrics"`
}

// NewLyricsService creates a new LyricsService
func NewLyricsService() *LyricsService {
	return &LyricsService{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// GetLyrics gets lyrics for a song using artist and title
func (l *LyricsService) GetLyrics(artist, title string) (string, error) {
	// Clean up the title and artist for the API request
	cleanTitle := l.cleanForAPI(title)
	cleanArtist := l.cleanForAPI(artist)

	// First try the main lyrics API
	lyrics, err := l.getLyricsFromMainAPI(cleanArtist, cleanTitle)
	if err != nil {
		// If that fails, return an empty string (which will trigger fallback in the frontend)
		return "", err
	}

	return lyrics, nil
}

// cleanForAPI removes extra information from song title and artist for API search
func (l *LyricsService) cleanForAPI(s string) string {
	// Remove content in parentheses and brackets
	cleaned := s
	for {
		start := -1
		end := -1

		// Find the last opening parenthesis/bracket and first closing one after it
		for i, char := range cleaned {
			if char == '(' || char == '[' {
				start = i
			} else if (char == ')' || char == ']') && start != -1 {
				end = i
				break
			}
		}

		if start == -1 || end == -1 {
			break
		}

		// Remove the content including the brackets
		cleaned = cleaned[:start] + cleaned[end+1:]
	}

	// Split on '&' and take the first part for artist
	if strings.Contains(s, "&") { // Only for artist
		parts := strings.Split(cleaned, "&")
		if len(parts) > 0 {
			cleaned = strings.TrimSpace(parts[0])
		}
	}

	// Trim and return
	return strings.TrimSpace(cleaned)
}

// getLyricsFromMainAPI gets lyrics from the main API
func (l *LyricsService) getLyricsFromMainAPI(artist, title string) (string, error) {
	// Use the lyrics.ovh API
	apiURL := fmt.Sprintf(
		"https://api.lyrics.ovh/v1/%s/%s",
		url.QueryEscape(artist),
		url.QueryEscape(title),
	)

	resp, err := l.client.Get(apiURL)
	if err != nil {
		return "", fmt.Errorf("failed to make lyrics API request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("lyrics API request failed with status: %d", resp.StatusCode)
	}

	var lyricsResp LyricsResponse
	if err := json.NewDecoder(resp.Body).Decode(&lyricsResp); err != nil {
		return "", fmt.Errorf("failed to decode lyrics API response: %w", err)
	}

	if lyricsResp.Lyrics == "" {
		return "", fmt.Errorf("no lyrics found")
	}

	return lyricsResp.Lyrics, nil
}