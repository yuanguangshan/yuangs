package services

import (
	"encoding/json"
	"os"
	"sync"
	"time"
)

// HistoryItem represents a history record
type HistoryItem struct {
	TrackID       string    `json:"trackId"`
	TrackName     string    `json:"trackName"`
	ArtistName    string    `json:"artistName"`
	ArtworkURL    string    `json:"artworkUrl"`
	PreviewURL    string    `json:"previewUrl"`
	CollectionName string   `json:"collectionName"`
	PlayedAt      time.Time `json:"playedAt"`
}

// HistoryService handles play history functionality
type HistoryService struct {
	history  []HistoryItem
	mu       sync.RWMutex
	filename string
	maxItems int
}

// NewHistoryService creates a new HistoryService with a maximum of 100 items
func NewHistoryService() *HistoryService {
	service := &HistoryService{
		history:  make([]HistoryItem, 0),
		filename: "history.json",
		maxItems: 100, // Maximum number of history items to keep
	}
	
	// Load existing history from file
	service.loadFromFile()
	
	return service
}

// GetAll returns all history items
func (h *HistoryService) GetAll() []HistoryItem {
	h.mu.RLock()
	defer h.mu.RUnlock()
	
	// Create a copy to prevent race conditions
	result := make([]HistoryItem, len(h.history))
	copy(result, h.history)
	
	return result
}

// Add adds a song to history
func (h *HistoryService) Add(song HistoryItem) {
	h.mu.Lock()
	defer h.mu.Unlock()
	
	// Remove any existing entries for this track
	h.history = removeTrackFromHistory(h.history, song.TrackID)
	
	// Add to the beginning of the history
	song.PlayedAt = time.Now()
	h.history = append([]HistoryItem{song}, h.history...)
	
	// Keep only the most recent maxItems items
	if len(h.history) > h.maxItems {
		h.history = h.history[:h.maxItems]
	}
	
	// Save to file
	h.saveToFile()
}

// Remove removes a song from history
func (h *HistoryService) Remove(trackID string) bool {
	h.mu.Lock()
	defer h.mu.Unlock()
	
	originalLen := len(h.history)
	h.history = removeTrackFromHistory(h.history, trackID)
	
	if len(h.history) < originalLen {
		// Save to file if something was removed
		h.saveToFile()
		return true
	}
	
	return false
}

// Clear removes all history
func (h *HistoryService) Clear() {
	h.mu.Lock()
	defer h.mu.Unlock()
	
	h.history = make([]HistoryItem, 0)
	
	// Save to file
	h.saveToFile()
}

// Export exports history to JSON
func (h *HistoryService) Export() ([]byte, error) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	
	return json.MarshalIndent(h.history, "", "  ")
}

// Import imports history from JSON
func (h *HistoryService) Import(data []byte) error {
	h.mu.Lock()
	defer h.mu.Unlock()
	
	var imported []HistoryItem
	if err := json.Unmarshal(data, &imported); err != nil {
		return err
	}
	
	h.history = imported
	
	// Save to file
	h.saveToFile()
	
	return nil
}

// Count returns the number of history items
func (h *HistoryService) Count() int {
	h.mu.RLock()
	defer h.mu.RUnlock()
	
	return len(h.history)
}

// saveToFile saves history to a JSON file
func (h *HistoryService) saveToFile() {
	file, err := json.MarshalIndent(h.history, "", "  ")
	if err != nil {
		// Log the error or handle it appropriately
		return
	}
	
	if err := os.WriteFile(h.filename, file, 0644); err != nil {
		// Log the error or handle it appropriately
		return
	}
}

// loadFromFile loads history from a JSON file
func (h *HistoryService) loadFromFile() {
	file, err := os.ReadFile(h.filename)
	if err != nil {
		// If file doesn't exist, that's okay - we'll start with an empty list
		return
	}
	
	var history []HistoryItem
	if err := json.Unmarshal(file, &history); err != nil {
		// If JSON is invalid, start with an empty list
		return
	}
	
	h.history = history
}

// removeTrackFromHistory removes all occurrences of a track from history
func removeTrackFromHistory(history []HistoryItem, trackID string) []HistoryItem {
	result := make([]HistoryItem, 0, len(history))
	for _, item := range history {
		if item.TrackID != trackID {
			result = append(result, item)
		}
	}
	return result
}

// GetLast returns the last played item
func (h *HistoryService) GetLast() *HistoryItem {
	h.mu.RLock()
	defer h.mu.RUnlock()
	
	if len(h.history) == 0 {
		return nil
	}
	
	item := h.history[0]
	return &item
}

// GetByTrackID returns a history item by track ID
func (h *HistoryService) GetByTrackID(trackID string) *HistoryItem {
	h.mu.RLock()
	defer h.mu.RUnlock()
	
	for _, item := range h.history {
		if item.TrackID == trackID {
			return &item // Return a copy
		}
	}
	
	return nil
}