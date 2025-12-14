package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

// ITunesService handles interactions with iTunes API
type ITunesService struct {
	client *http.Client
}

// ITunesResult represents a single result from iTunes API
type ITunesResult struct {
	ArtistName      string `json:"artistName"`
	TrackName       string `json:"trackName"`
	TrackID         int64  `json:"trackId"`
	CollectionName  string `json:"collectionName"`
	ArtworkURL100   string `json:"artworkUrl100"`
	PreviewURL      string `json:"previewUrl"`
	Kind            string `json:"kind"`
	Genre           string `json:"primaryGenreName"`
	ReleaseDate     string `json:"releaseDate"`
	CollectionID    int64  `json:"collectionId"`
	TrackTimeMillis int64  `json:"trackTimeMillis"`
}

// ITunesResponse represents the iTunes API response
type ITunesResponse struct {
	ResultCount int64         `json:"resultCount"`
	Results     []ITunesResult `json:"results"`
}

// NewITunesService creates a new ITunesService
func NewITunesService() *ITunesService {
	return &ITunesService{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// Search searches for music on iTunes
func (i *ITunesService) Search(query string, limit int) (*ITunesResponse, error) {
	// Construct the iTunes API URL with 'limit' parameter
	// Note: iTunes API uses 'limit' but actually limits to 50 max per request
	apiURL := fmt.Sprintf(
		"https://itunes.apple.com/search?term=%s&entity=song&limit=%d&country=cn",
		url.QueryEscape(query),
		limit,
	)

	resp, err := i.client.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("failed to make iTunes API request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("iTunes API request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read iTunes API response: %w", err)
	}

	var iTunesResp ITunesResponse
	if err := json.Unmarshal(body, &iTunesResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal iTunes API response: %w", err)
	}

	// Limit results to the requested limit (iTunes might return more than requested)
	if iTunesResp.ResultCount > int64(limit) {
		iTunesResp.ResultCount = int64(limit)
		if len(iTunesResp.Results) > limit {
			iTunesResp.Results = iTunesResp.Results[:limit]
		}
	}

	return &iTunesResp, nil
}

// GetTrack gets detailed information about a specific track
func (i *ITunesService) GetTrack(trackID int64) (*ITunesResult, error) {
	// Use iTunes lookup API to get a specific track by ID
	apiURL := fmt.Sprintf("https://itunes.apple.com/lookup?id=%d", trackID)

	resp, err := i.client.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("failed to make iTunes lookup request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("iTunes lookup request failed with status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read iTunes lookup response: %w", err)
	}

	var result struct {
		ResultCount int64          `json:"resultCount"`
		Results     []ITunesResult `json:"results"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal iTunes lookup response: %w", err)
	}

	if result.ResultCount == 0 || len(result.Results) == 0 {
		return nil, fmt.Errorf("track not found")
	}

	return &result.Results[0], nil
}