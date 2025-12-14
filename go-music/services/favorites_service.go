package services

import (
	"encoding/json"
	"os"
	"sync"
	"time"
)

// Favorite represents a favorite song
type Favorite struct {
	TrackID     string    `json:"trackId"`
	TrackName   string    `json:"trackName"`
	ArtistName  string    `json:"artistName"`
	ArtworkURL  string    `json:"artworkUrl"`
	PreviewURL  string    `json:"previewUrl"`
	CollectionName string `json:"collectionName"`
	FavoritedAt time.Time `json:"favoritedAt"`
}

// FavoritesService handles favorites functionality
type FavoritesService struct {
	favorites []Favorite
	mu        sync.RWMutex
	filename  string
}

// NewFavoritesService creates a new FavoritesService
func NewFavoritesService() *FavoritesService {
	service := &FavoritesService{
		favorites: make([]Favorite, 0),
		filename:  "favorites.json",
	}
	
	// Load existing favorites from file
	service.loadFromFile()
	
	return service
}

// GetAll returns all favorites
func (f *FavoritesService) GetAll() []Favorite {
	f.mu.RLock()
	defer f.mu.RUnlock()
	
	// Create a copy to prevent race conditions
	result := make([]Favorite, len(f.favorites))
	copy(result, f.favorites)
	
	return result
}

// Add adds a song to favorites
func (f *FavoritesService) Add(song Favorite) bool {
	f.mu.Lock()
	defer f.mu.Unlock()
	
	// Check if already exists
	for _, existing := range f.favorites {
		if existing.TrackID == song.TrackID {
			return false // Already exists
		}
	}
	
	// Set the favorited time
	song.FavoritedAt = time.Now()
	
	// Add to favorites
	f.favorites = append(f.favorites, song)
	
	// Save to file
	f.saveToFile()
	
	return true
}

// Remove removes a song from favorites
func (f *FavoritesService) Remove(trackID string) bool {
	f.mu.Lock()
	defer f.mu.Unlock()
	
	// Find and remove the song
	for i, favorite := range f.favorites {
		if favorite.TrackID == trackID {
			// Remove from slice
			f.favorites = append(f.favorites[:i], f.favorites[i+1:]...)
			
			// Save to file
			f.saveToFile()
			
			return true
		}
	}
	
	return false
}

// IsFavorited checks if a song is in favorites
func (f *FavoritesService) IsFavorited(trackID string) bool {
	f.mu.RLock()
	defer f.mu.RUnlock()
	
	for _, favorite := range f.favorites {
		if favorite.TrackID == trackID {
			return true
		}
	}
	
	return false
}

// Clear removes all favorites
func (f *FavoritesService) Clear() {
	f.mu.Lock()
	defer f.mu.Unlock()
	
	f.favorites = make([]Favorite, 0)
	
	// Save to file
	f.saveToFile()
}

// export exports favorites to JSON
func (f *FavoritesService) Export() ([]byte, error) {
	f.mu.RLock()
	defer f.mu.RUnlock()
	
	return json.MarshalIndent(f.favorites, "", "  ")
}

// Import imports favorites from JSON
func (f *FavoritesService) Import(data []byte) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	
	var imported []Favorite
	if err := json.Unmarshal(data, &imported); err != nil {
		return err
	}
	
	f.favorites = imported
	
	// Save to file
	f.saveToFile()
	
	return nil
}

// saveToFile saves favorites to a JSON file
func (f *FavoritesService) saveToFile() {
	file, err := json.MarshalIndent(f.favorites, "", "  ")
	if err != nil {
		// Log the error or handle it appropriately
		return
	}
	
	if err := os.WriteFile(f.filename, file, 0644); err != nil {
		// Log the error or handle it appropriately
		return
	}
}

// loadFromFile loads favorites from a JSON file
func (f *FavoritesService) loadFromFile() {
	file, err := os.ReadFile(f.filename)
	if err != nil {
		// If file doesn't exist, that's okay - we'll start with an empty list
		return
	}
	
	var favorites []Favorite
	if err := json.Unmarshal(file, &favorites); err != nil {
		// If JSON is invalid, start with an empty list
		return
	}
	
	f.favorites = favorites
}

// Count returns the number of favorites
func (f *FavoritesService) Count() int {
	f.mu.RLock()
	defer f.mu.RUnlock()
	
	return len(f.favorites)
}