package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

// cacheItem represents a cached response with expiration
type cacheItem struct {
	data      interface{}
	expiresAt time.Time
}

// YouTubeMusicService handles interactions with YouTube Music API
type YouTubeMusicService struct {
	client *http.Client
	// 添加缓存以减少重复请求
	cache map[string]*cacheItem
	mutex sync.RWMutex
	// API基础URL
	apiBaseURL string
}

// YouTubeSong represents a song from YouTube Music
type YouTubeSong struct {
	Title        string      `json:"title"`
	VideoID      string      `json:"video_id"`
	Artists      []string    `json:"artists"`
	Album        string      `json:"album"`
	Duration     string      `json:"duration"`
	Thumbnails   []Thumbnail `json:"thumbnails"`
	ThumbnailURL string      `json:"thumbnail_url"`
	YouTubeURL   string      `json:"youtube_url"`
	YouTubeMusicURL string `json:"youtube_music_url"`
	EmbedURL     string      `json:"embed_url"`
}

// Thumbnail represents a thumbnail image
type Thumbnail struct {
	URL    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

// YouTubeArtist represents an artist from YouTube Music
type YouTubeArtist struct {
	Name         string      `json:"name"`
	ChannelID    string      `json:"browse_id"`
	Thumbnails   []Thumbnail `json:"thumbnails"`
	ThumbnailURL string      `json:"thumbnail_url"`
}

// YouTubeArtistInfo represents detailed artist information
type YouTubeArtistInfo struct {
	Name         string      `json:"name"`
	Description  string      `json:"description"`
	Subscribers  string      `json:"subscribers"`
	Thumbnails   []Thumbnail `json:"thumbnails"`
	ThumbnailURL string      `json:"thumbnail_url"`
	TopSongs     []YouTubeSong `json:"top_songs"`
}

// YouTubeLyrics represents lyrics for a song
type YouTubeLyrics struct {
	Text   string `json:"lyrics"`
	Source string `json:"source"`
}

// YouTubeSongDetails represents complete song information
type YouTubeSongDetails struct {
	VideoID       string        `json:"video_id"`
	Title         string        `json:"title"`
	Artists       []string      `json:"artists"`
	Album         string        `json:"album"`
	Thumbnails    []Thumbnail   `json:"thumbnails"`
	ThumbnailURL  string        `json:"thumbnail_url"`
	YouTubeURL    string        `json:"youtube_url"`
	YouTubeMusicURL string      `json:"youtube_music_url"`
	EmbedURL      string        `json:"embed_url"`
	Lyrics        *YouTubeLyrics `json:"lyrics,omitempty"`
}

// SearchResponse represents the search response structure
type SearchResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// NewYouTubeMusicService creates a new YouTubeMusicService
func NewYouTubeMusicService() *YouTubeMusicService {
	return &YouTubeMusicService{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
		cache: make(map[string]*cacheItem),
		apiBaseURL: "https://api.yuangs.cc", // 使用您的API端点
	}
}

// SearchSong searches for songs on YouTube Music
func (y *YouTubeMusicService) SearchSong(query string, limit int) (*SearchResponse, error) {
	// Create cache key
	cacheKey := fmt.Sprintf("song:%s:%d", query, limit)

	// Check cache first
	if cachedData, found := y.getFromCache(cacheKey); found {
		if response, ok := cachedData.(*SearchResponse); ok {
			return response, nil
		}
	}

	// Proxy to your API endpoint
	result, err := y.proxyToYourAPI("/youtubeapi/search/song", map[string]string{
		"q": query,
		"limit": fmt.Sprintf("%d", limit),
	})
	if err != nil {
		return result, err
	}

	// Cache successful results
	if result.Success {
		y.setInCache(cacheKey, result)
	}

	return result, nil
}

// searchYouTubeMusic makes a real API call to YouTube Music
func (y *YouTubeMusicService) searchYouTubeMusic(query string, limit int) (*SearchResponse, error) {
	// Apply rate limiting to avoid overwhelming the API
	y.rateLimit()

	// YouTube Music API endpoint (using the innertube API)
	apiURL := "https://music.youtube.com/youtubei/v1/search"

	// Prepare the request payload for YouTube Music API
	payload := map[string]interface{}{
		"context": map[string]interface{}{
			"client": map[string]interface{}{
				"clientName": "WEB_REMIX",
				"clientVersion": "1.20240806.01.00", // Use a recent version
				"hl": "zh-CN",
				"gl": "CN",
			},
		},
		"query": query,
		"params": "Eg-KAQwIARAAGAAgACgAMABqChADEAQQCRAFEAo=",
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to marshal request: %v", err),
		}, nil
	}

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to create request: %v", err),
		}, nil
	}

	// Set required headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
	req.Header.Set("X-YouTube-Client-Name", "67")
	req.Header.Set("X-YouTube-Client-Version", "1.20210722.00.00")
	req.Header.Set("Origin", "https://music.youtube.com")
	req.Header.Set("Referer", "https://music.youtube.com/")

	resp, err := y.client.Do(req)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to make request: %v", err),
		}, nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("API request failed with status: %d", resp.StatusCode),
		}, nil
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to read response: %v", err),
		}, nil
	}

	// Parse the response
	var apiResponse map[string]interface{}
	if err := json.Unmarshal(body, &apiResponse); err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to parse response: %v", err),
		}, nil
	}

	// Extract the contents from the response
	contents, ok := apiResponse["contents"].(map[string]interface{})
	if !ok {
		return &SearchResponse{
			Success: false,
			Error:   "invalid response format: missing contents",
		}, nil
	}

	tabbed, ok := contents["tabbedSearchResultsRenderer"].(map[string]interface{})
	if !ok {
		return &SearchResponse{
			Success: false,
			Error:   "invalid response format: missing tabbedSearchResultsRenderer",
		}, nil
	}

	tabs, ok := tabbed["tabs"].([]interface{})
	if !ok {
		return &SearchResponse{
			Success: false,
			Error:   "invalid response format: missing tabs",
		}, nil
	}

	var songs []YouTubeSong
	for _, tabIface := range tabs {
		tab, ok := tabIface.(map[string]interface{})
		if !ok {
			continue
		}

		tabRenderer, ok := tab["tabRenderer"].(map[string]interface{})
		if !ok {
			continue
		}

		content, ok := tabRenderer["content"].(map[string]interface{})
		if !ok {
			continue
		}

		sectionList, ok := content["sectionListRenderer"].(map[string]interface{})
		if !ok {
			continue
		}

		contentsList, ok := sectionList["contents"].([]interface{})
		if !ok {
			continue
		}

		for _, contentIface := range contentsList {
			contentMap, ok := contentIface.(map[string]interface{})
			if !ok {
				continue
			}

			// Look for musicShelfRenderer which contains the search results
			if musicShelf, exists := contentMap["musicShelfRenderer"]; exists {
				musicShelfMap, ok := musicShelf.(map[string]interface{})
				if !ok {
					continue
				}

				contents, ok := musicShelfMap["contents"].([]interface{})
				if !ok {
					continue
				}

				for _, itemIface := range contents {
					itemMap, ok := itemIface.(map[string]interface{})
					if !ok {
						continue
					}

					// Look for musicResponsiveListItemRenderer
					if musicItem, exists := itemMap["musicResponsiveListItemRenderer"]; exists {
						musicItemMap, ok := musicItem.(map[string]interface{})
						if !ok {
							continue
						}

						flexColumns, ok := musicItemMap["flexColumns"].([]interface{})
						if !ok {
							continue
						}

						// Extract title
						var title string
						if len(flexColumns) > 0 {
							col, ok := flexColumns[0].(map[string]interface{})
							if ok {
								fixed, ok := col["musicResponsiveListItemFlexColumnRenderer"].(map[string]interface{})
								if ok {
									texts, ok := fixed["text"].(map[string]interface{})
									if ok {
										runs, ok := texts["runs"].([]interface{})
										if ok && len(runs) > 0 {
											if run, ok := runs[0].(map[string]interface{}); ok {
												title, _ = run["text"].(string)
											}
										}
									}
								}
							}
						}

						// Find video ID
						var videoID string
						if navigationEndpoints, exists := musicItemMap["navigationEndpoints"].([]interface{}); exists && len(navigationEndpoints) > 0 {
							if endpoint, ok := navigationEndpoints[0].(map[string]interface{}); ok {
								if browseEndpoint, exists := endpoint["clickCommand"].(map[string]interface{}); exists {
									if watchEndpoint, exists := browseEndpoint["watchEndpoint"].(map[string]interface{}); exists {
										videoID, _ = watchEndpoint["videoId"].(string)
									}
								}
							}
						}

						// Extract artist names
						var artists []string
						if len(flexColumns) > 1 {
							col, ok := flexColumns[1].(map[string]interface{})
							if ok {
								fixed, ok := col["musicResponsiveListItemFlexColumnRenderer"].(map[string]interface{})
								if ok {
									texts, ok := fixed["text"].(map[string]interface{})
									if ok {
										runs, ok := texts["runs"].([]interface{})
										if ok {
											for _, runIface := range runs {
												if run, ok := runIface.(map[string]interface{}); ok {
													if text, ok := run["text"].(string); ok {
														if !strings.Contains(text, " • ") && !strings.Contains(text, "Album") {
															artists = append(artists, text)
														}
													}
												}
											}
										}
									}
								}
							}
						}

						// Extract album
						var album string
						if len(flexColumns) > 2 {
							col, ok := flexColumns[2].(map[string]interface{})
							if ok {
								fixed, ok := col["musicResponsiveListItemFlexColumnRenderer"].(map[string]interface{})
								if ok {
									texts, ok := fixed["text"].(map[string]interface{})
									if ok {
										runs, ok := texts["runs"].([]interface{})
										if ok {
											for _, runIface := range runs {
												if run, ok := runIface.(map[string]interface{}); ok {
													if text, ok := run["text"].(string); ok {
														album = text
														break
													}
												}
											}
										}
									}
								}
							}
						}

						// Extract thumbnails
						var thumbnails []Thumbnail
						var thumbnailURL string
						if thumbnailRenderer, exists := musicItemMap["thumbnail"].(map[string]interface{}); exists {
							if musicThumbnail, exists := thumbnailRenderer["musicThumbnailRenderer"].(map[string]interface{}); exists {
								if thumbnailCt, exists := musicThumbnail["thumbnail"].(map[string]interface{}); exists {
									if thumbnailsList, exists := thumbnailCt["thumbnails"].([]interface{}); exists {
										for _, thumbIface := range thumbnailsList {
											if thumb, ok := thumbIface.(map[string]interface{}); ok {
												url, _ := thumb["url"].(string)
												width, _ := thumb["width"].(float64)
												height, _ := thumb["height"].(float64)
												if url != "" {
													thumbnailURL = url
													thumbnails = append(thumbnails, Thumbnail{
														URL:    url,
														Width:  int(width),
														Height: int(height),
													})
												}
											}
										}
									}
								}
							}
						}

						// Add to songs list if we have a video ID
						if videoID != "" {
							song := YouTubeSong{
								Title:          title,
								VideoID:        videoID,
								Artists:        artists,
								Album:          album,
								Thumbnails:     thumbnails,
								ThumbnailURL:   thumbnailURL,
								YouTubeURL:     fmt.Sprintf("https://www.youtube.com/watch?v=%s", videoID),
								YouTubeMusicURL: fmt.Sprintf("https://music.youtube.com/watch?v=%s", videoID),
								EmbedURL:       fmt.Sprintf("https://www.youtube.com/embed/%s", videoID),
							}
							songs = append(songs, song)

							// Limit the results
							if len(songs) >= limit {
								break
							}
						}
					}
				}

				if len(songs) >= limit {
					break
				}
			}
		}

		if len(songs) >= limit {
			break
		}
	}

	return &SearchResponse{
		Success: true,
		Data:    songs,
	}, nil
}

// SearchArtist searches for artists on YouTube Music
func (y *YouTubeMusicService) SearchArtist(query string, limit int) (*SearchResponse, error) {
	// Create cache key
	cacheKey := fmt.Sprintf("artist:%s:%d", query, limit)

	// Check cache first
	if cachedData, found := y.getFromCache(cacheKey); found {
		if response, ok := cachedData.(*SearchResponse); ok {
			return response, nil
		}
	}

	// Proxy to your API endpoint
	result, err := y.proxyToYourAPI("/youtubeapi/search/artist", map[string]string{
		"q": query,
		"limit": fmt.Sprintf("%d", limit),
	})
	if err != nil {
		return result, err
	}

	// Cache successful results
	if result.Success {
		y.setInCache(cacheKey, result)
	}

	return result, nil
}

// searchArtistsYouTubeMusic makes a real API call to YouTube Music for artist search
func (y *YouTubeMusicService) searchArtistsYouTubeMusic(query string, limit int) (*SearchResponse, error) {
	// Apply rate limiting to avoid overwhelming the API
	y.rateLimit()

	// YouTube Music API endpoint (using the innertube API)
	apiURL := "https://music.youtube.com/youtubei/v1/search"

	// Prepare the request payload for YouTube Music API
	payload := map[string]interface{}{
		"context": map[string]interface{}{
			"client": map[string]interface{}{
				"clientName": "WEB_REMIX",
				"clientVersion": "1.20240806.01.00", // Use a recent version
				"hl": "zh-CN",
				"gl": "CN",
			},
		},
		"query": query,
		"params": "Eg-KAQwIARABGAEgACgAMABqChADEAQQCRAFEAo=",
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to marshal request: %v", err),
		}, nil
	}

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to create request: %v", err),
		}, nil
	}

	// Set required headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
	req.Header.Set("X-YouTube-Client-Name", "67")
	req.Header.Set("X-YouTube-Client-Version", "1.20210722.00.00")
	req.Header.Set("Origin", "https://music.youtube.com")
	req.Header.Set("Referer", "https://music.youtube.com/")

	resp, err := y.client.Do(req)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to make request: %v", err),
		}, nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("API request failed with status: %d", resp.StatusCode),
		}, nil
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to read response: %v", err),
		}, nil
	}

	// Parse the response
	var apiResponse map[string]interface{}
	if err := json.Unmarshal(body, &apiResponse); err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to parse response: %v", err),
		}, nil
	}

	// Extract the contents from the response
	contents, ok := apiResponse["contents"].(map[string]interface{})
	if !ok {
		return &SearchResponse{
			Success: false,
			Error:   "invalid response format: missing contents",
		}, nil
	}

	tabbed, ok := contents["tabbedSearchResultsRenderer"].(map[string]interface{})
	if !ok {
		return &SearchResponse{
			Success: false,
			Error:   "invalid response format: missing tabbedSearchResultsRenderer",
		}, nil
	}

	tabs, ok := tabbed["tabs"].([]interface{})
	if !ok {
		return &SearchResponse{
			Success: false,
			Error:   "invalid response format: missing tabs",
		}, nil
	}

	var artists []YouTubeArtist
	for _, tabIface := range tabs {
		tab, ok := tabIface.(map[string]interface{})
		if !ok {
			continue
		}

		tabRenderer, ok := tab["tabRenderer"].(map[string]interface{})
		if !ok {
			continue
		}

		content, ok := tabRenderer["content"].(map[string]interface{})
		if !ok {
			continue
		}

		sectionList, ok := content["sectionListRenderer"].(map[string]interface{})
		if !ok {
			continue
		}

		contentsList, ok := sectionList["contents"].([]interface{})
		if !ok {
			continue
		}

		for _, contentIface := range contentsList {
			contentMap, ok := contentIface.(map[string]interface{})
			if !ok {
				continue
			}

			// Look for musicShelfRenderer which contains the search results
			if musicShelf, exists := contentMap["musicShelfRenderer"]; exists {
				musicShelfMap, ok := musicShelf.(map[string]interface{})
				if !ok {
					continue
				}

				contents, ok := musicShelfMap["contents"].([]interface{})
				if !ok {
					continue
				}

				for _, itemIface := range contents {
					itemMap, ok := itemIface.(map[string]interface{})
					if !ok {
						continue
					}

					// Look for musicResponsiveListItemRenderer for artists
					if musicItem, exists := itemMap["musicResponsiveListItemRenderer"]; exists {
						musicItemMap, ok := musicItem.(map[string]interface{})
						if !ok {
							continue
						}

						flexColumns, ok := musicItemMap["flexColumns"].([]interface{})
						if !ok {
							continue
						}

						// Extract artist name
						var artistName string
						if len(flexColumns) > 0 {
							col, ok := flexColumns[0].(map[string]interface{})
							if ok {
								fixed, ok := col["musicResponsiveListItemFlexColumnRenderer"].(map[string]interface{})
								if ok {
									texts, ok := fixed["text"].(map[string]interface{})
									if ok {
										runs, ok := texts["runs"].([]interface{})
										if ok && len(runs) > 0 {
											if run, ok := runs[0].(map[string]interface{}); ok {
												artistName, _ = run["text"].(string)
											}
										}
									}
								}
							}
						}

						// Find channel ID
						var channelID string
						if navigationEndpoints, exists := musicItemMap["navigationEndpoints"].([]interface{}); exists && len(navigationEndpoints) > 0 {
							for _, endpointIface := range navigationEndpoints {
								endpoint, ok := endpointIface.(map[string]interface{})
								if !ok {
									continue
								}
								if browseEndpoint, exists := endpoint["clickCommand"].(map[string]interface{}); exists {
									if browseEndpoint2, exists := browseEndpoint["browseEndpoint"].(map[string]interface{}); exists {
										if browseID, ok := browseEndpoint2["browseId"].(string); ok && strings.HasPrefix(browseID, "UC") {
											channelID = browseID
											break
										}
									}
								}
							}
						}

						// Extract thumbnails
						var thumbnails []Thumbnail
						var thumbnailURL string
						if thumbnailRenderer, exists := musicItemMap["thumbnail"].(map[string]interface{}); exists {
							if musicThumbnail, exists := thumbnailRenderer["musicThumbnailRenderer"].(map[string]interface{}); exists {
								if thumbnailCt, exists := musicThumbnail["thumbnail"].(map[string]interface{}); exists {
									if thumbnailsList, exists := thumbnailCt["thumbnails"].([]interface{}); exists {
										for _, thumbIface := range thumbnailsList {
											if thumb, ok := thumbIface.(map[string]interface{}); ok {
												url, _ := thumb["url"].(string)
												width, _ := thumb["width"].(float64)
												height, _ := thumb["height"].(float64)
												if url != "" {
													thumbnailURL = url
													thumbnails = append(thumbnails, Thumbnail{
														URL:    url,
														Width:  int(width),
														Height: int(height),
													})
												}
											}
										}
									}
								}
							}
						}

						// Add to artists list if we have a channel ID
						if channelID != "" {
							artist := YouTubeArtist{
								Name:          artistName,
								ChannelID:     channelID,
								Thumbnails:    thumbnails,
								ThumbnailURL:  thumbnailURL,
							}
							artists = append(artists, artist)

							// Limit the results
							if len(artists) >= limit {
								break
							}
						}
					}
				}

				if len(artists) >= limit {
					break
				}
			}
		}

		if len(artists) >= limit {
			break
		}
	}

	return &SearchResponse{
		Success: true,
		Data:    artists,
	}, nil
}

// GetArtistInfo gets detailed information about an artist
func (y *YouTubeMusicService) GetArtistInfo(channelID string) (*SearchResponse, error) {
	// Create cache key
	cacheKey := fmt.Sprintf("artist_info:%s", channelID)

	// Check cache first
	if cachedData, found := y.getFromCache(cacheKey); found {
		if response, ok := cachedData.(*SearchResponse); ok {
			return response, nil
		}
	}

	// Proxy to your API endpoint
	result, err := y.proxyToYourAPI(fmt.Sprintf("/youtubeapi/artist/%s", channelID), map[string]string{})
	if err != nil {
		return result, err
	}

	// Cache successful results
	if result.Success {
		y.setInCache(cacheKey, result)
	}

	return result, nil
}

// GetLyrics gets lyrics for a song
func (y *YouTubeMusicService) GetLyrics(videoID string) (*SearchResponse, error) {
	// Create cache key
	cacheKey := fmt.Sprintf("lyrics:%s", videoID)

	// Check cache first
	if cachedData, found := y.getFromCache(cacheKey); found {
		if response, ok := cachedData.(*SearchResponse); ok {
			return response, nil
		}
	}

	// Proxy to your API endpoint
	result, err := y.proxyToYourAPI(fmt.Sprintf("/youtubeapi/lyrics/%s", videoID), map[string]string{})
	if err != nil {
		return result, err
	}

	// Cache successful results (or even unsuccessful ones to prevent repeated requests)
	y.setInCache(cacheKey, result)

	return result, nil
}

// GetSongDetails gets complete information about a song
func (y *YouTubeMusicService) GetSongDetails(videoID string) (*SearchResponse, error) {
	// Create cache key
	cacheKey := fmt.Sprintf("song_details:%s", videoID)

	// Check cache first
	if cachedData, found := y.getFromCache(cacheKey); found {
		if response, ok := cachedData.(*SearchResponse); ok {
			return response, nil
		}
	}

	// Proxy to your API endpoint
	result, err := y.proxyToYourAPI(fmt.Sprintf("/youtubeapi/song/%s", videoID), map[string]string{})
	if err != nil {
		return result, err
	}

	// Cache successful results
	if result.Success {
		y.setInCache(cacheKey, result)
	}

	return result, nil
}

// ProxyRequest makes an HTTP request to an external API and returns the response
func (y *YouTubeMusicService) ProxyRequest(apiURL string) (*SearchResponse, error) {
	resp, err := y.client.Get(apiURL)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   err.Error(),
		}, nil
	}
	defer resp.Body.Close()

	// Read the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   err.Error(),
		}, nil
	}

	// If the response status is not OK, return an error
	if resp.StatusCode != http.StatusOK {
		// Try to parse the error response
		var errorResp map[string]interface{}
		if jsonErr := json.Unmarshal(body, &errorResp); jsonErr == nil {
			if errorMsg, ok := errorResp["error"]; ok {
				return &SearchResponse{
					Success: false,
					Error:   fmt.Sprintf("API request failed: %v (Status: %d)", errorMsg, resp.StatusCode),
				}, nil
			}
		}
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("API request failed with status: %d", resp.StatusCode),
		}, nil
	}

	// Parse the JSON response to determine if it's a success or error
	var parsedResp SearchResponse
	if err := json.Unmarshal(body, &parsedResp); err != nil {
		// If it's not in the expected format, try to parse as raw data
		var rawData interface{}
		if rawErr := json.Unmarshal(body, &rawData); rawErr != nil {
			return &SearchResponse{
				Success: false,
				Error:   "Failed to parse API response",
			}, nil
		}

		// If we get here, assume it's valid data
		return &SearchResponse{
			Success: true,
			Data:    rawData,
		}, nil
	}

	return &parsedResp, nil
}

// External API call example (if needed)
func (y *YouTubeMusicService) callExternalAPI(endpoint string, params url.Values) ([]byte, error) {
	reqURL := "https://music.youtube.com/youtubei/v1/" + endpoint
	req, err := http.NewRequest("POST", reqURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set required headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
	req.Header.Set("X-YouTube-Client-Name", "1")
	req.Header.Set("X-YouTube-Client-Version", "2.20230209.02.00")

	// Add parameters as needed
	if params != nil {
		req.URL.RawQuery = params.Encode()
	}

	resp, err := y.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	return io.ReadAll(resp.Body)
}

// getFromCache retrieves a value from cache if it exists and hasn't expired
func (y *YouTubeMusicService) getFromCache(key string) (interface{}, bool) {
	y.mutex.RLock()
	defer y.mutex.RUnlock()

	item, exists := y.cache[key]
	if !exists {
		return nil, false
	}

	// Check if the item is expired
	if time.Now().After(item.expiresAt) {
		// Remove expired item
		delete(y.cache, key)
		return nil, false
	}

	return item.data, true
}

// setInCache stores a value in cache with a 15 minute expiration
func (y *YouTubeMusicService) setInCache(key string, data interface{}) {
	y.mutex.Lock()
	defer y.mutex.Unlock()

	// Cache for 15 minutes
	expiration := time.Now().Add(15 * time.Minute)
	y.cache[key] = &cacheItem{
		data:      data,
		expiresAt: expiration,
	}
}

// proxyToYourAPI makes a request to your API endpoint
func (y *YouTubeMusicService) proxyToYourAPI(endpoint string, params map[string]string) (*SearchResponse, error) {
	// Apply rate limiting to avoid overwhelming the API
	y.rateLimit()

	// Build URL with query parameters
	urlPath := y.apiBaseURL + endpoint
	if len(params) > 0 {
		urlPath += "?"
		first := true
		for key, value := range params {
			if !first {
				urlPath += "&"
			}
			urlPath += fmt.Sprintf("%s=%s", key, url.QueryEscape(value))
			first = false
		}
	}

	// Make GET request to your API
	req, err := http.NewRequest("GET", urlPath, nil)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to create request: %v", err),
		}, nil
	}

	// Set headers to mimic browser request
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8")

	resp, err := y.client.Do(req)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to make request: %v", err),
		}, nil
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to read response: %v", err),
		}, nil
	}

	// Check status
	if resp.StatusCode != http.StatusOK {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("API request failed with status: %d, body: %s", resp.StatusCode, string(body)),
		}, nil
	}

	// Parse the response
	var rawResponse map[string]interface{}
	if err := json.Unmarshal(body, &rawResponse); err != nil {
		return &SearchResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to parse response: %v", err),
		}, nil
	}

	// Check if the response has the expected format from your API
	if success, exists := rawResponse["success"]; exists {
		if successBool, isBool := success.(bool); isBool && successBool {
			// Handle the YouTubeMusic data format from your API
			if data, exists := rawResponse["data"]; exists {
				return &SearchResponse{
					Success: true,
					Data:    data,
				}, nil
			}
		} else {
			// If success is false, return error
			if err, exists := rawResponse["error"]; exists {
				if errStr, isStr := err.(string); isStr {
					return &SearchResponse{
						Success: false,
						Error:   errStr,
					}, nil
				}
			}
			return &SearchResponse{
				Success: false,
				Error:   "API request failed",
			}, nil
		}
	}

	// If the response doesn't have the expected "success" field, it might be a raw data response
	// Return it as success with raw data
	return &SearchResponse{
		Success: true,
		Data:    rawResponse,
	}, nil
}

// rateLimit makes a request with a small delay to avoid rate limiting
func (y *YouTubeMusicService) rateLimit() {
	// Add a small delay before each request to avoid rate limiting
	time.Sleep(250 * time.Millisecond)
}