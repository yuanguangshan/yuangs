package services

import (
	"encoding/json"
	"sync"
	"time"
)

// CacheItem represents a cached item with expiry
type CacheItem struct {
	Data      interface{}
	Expiry    time.Time
	CreatedAt time.Time
}

// CacheService handles caching functionality
type CacheService struct {
	data map[string]CacheItem
	mu   sync.RWMutex
}

// NewCacheService creates a new CacheService
func NewCacheService() *CacheService {
	cache := &CacheService{
		data: make(map[string]CacheItem),
	}
	
	// Start a goroutine to clean expired items periodically
	go cache.startCleanup()
	
	return cache
}

// Get retrieves a value from the cache
func (c *CacheService) Get(key string) (interface{}, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	item, exists := c.data[key]
	if !exists {
		return nil, false
	}

	// Check if the item has expired
	if time.Now().After(item.Expiry) {
		// Don't delete here to avoid race conditions with the cleanup goroutine
		// The cleanup goroutine will remove it
		return nil, false
	}

	return item.Data, true
}

// Set stores a value in the cache with an expiry time in hours
func (c *CacheService) Set(key string, value interface{}, expiryHours float64) {
	c.mu.Lock()
	defer c.mu.Unlock()

	expiry := time.Now().Add(time.Duration(expiryHours * float64(time.Hour)))
	
	c.data[key] = CacheItem{
		Data:      value,
		Expiry:    expiry,
		CreatedAt: time.Now(),
	}
}

// Remove removes a value from the cache
func (c *CacheService) Remove(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.data, key)
}

// Clear removes all values from the cache
func (c *CacheService) Clear() {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.data = make(map[string]CacheItem)
}

// startCleanup starts a goroutine that periodically removes expired items
func (c *CacheService) startCleanup() {
	ticker := time.NewTicker(5 * time.Minute) // Clean every 5 minutes
	defer ticker.Stop()

	for range ticker.C {
		c.mu.Lock()
		
		now := time.Now()
		for key, item := range c.data {
			if now.After(item.Expiry) {
				delete(c.data, key)
			}
		}
		
		c.mu.Unlock()
	}
}

// GetWithExpiry retrieves a value from the cache along with its expiry info
func (c *CacheService) GetWithExpiry(key string) (data interface{}, expiry time.Time, exists bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	item, exists := c.data[key]
	if !exists {
		return nil, time.Time{}, false
	}

	// Check if the item has expired
	if time.Now().After(item.Expiry) {
		return nil, time.Time{}, false
	}

	return item.Data, item.Expiry, true
}

// GetAllKeys returns all cache keys (for debugging purposes)
func (c *CacheService) GetAllKeys() []string {
	c.mu.RLock()
	defer c.mu.RUnlock()

	keys := make([]string, 0, len(c.data))
	for key := range c.data {
		keys = append(keys, key)
	}
	
	return keys
}

// Size returns the number of items in the cache
func (c *CacheService) Size() int {
	c.mu.RLock()
	defer c.mu.RUnlock()
	
	return len(c.data)
}

// ToJSON returns the cache data as JSON (for debugging)
func (c *CacheService) ToJSON() ([]byte, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	
	// Create a copy of the cache data without expired items
	activeData := make(map[string]interface{})
	now := time.Now()
	
	for key, item := range c.data {
		if !now.After(item.Expiry) {
			activeData[key] = item.Data
		}
	}
	
	return json.Marshal(activeData)
}