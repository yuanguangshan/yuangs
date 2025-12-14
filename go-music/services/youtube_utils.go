package services

import (
	"fmt"
	"strconv"
	"strings"
)

// GetBestThumbnail selects the highest quality thumbnail from a list
func (y *YouTubeMusicService) GetBestThumbnail(thumbnails []Thumbnail) string {
	if len(thumbnails) == 0 {
		return ""
	}

	// Find the thumbnail with the largest area (width * height)
	bestThumbnail := thumbnails[0]
	bestArea := bestThumbnail.Width * bestThumbnail.Height

	for _, thumb := range thumbnails[1:] {
		area := thumb.Width * thumb.Height
		if area > bestArea {
			bestThumbnail = thumb
			bestArea = area
		}
	}

	return bestThumbnail.URL
}

// CleanArtistName removes featured artists from the name
func (y *YouTubeMusicService) CleanArtistName(artistName string) string {
	// Split on common separators
	parts := strings.Split(artistName, "&")
	if len(parts) > 0 {
		// Take the first part before &
		artistName = strings.TrimSpace(parts[0])
	}

	// Further split on commas
	parts = strings.Split(artistName, ",")
	if len(parts) > 0 {
		artistName = strings.TrimSpace(parts[0])
	}

	return artistName
}

// FormatTime formats seconds into MM:SS format
func FormatTime(seconds float64) string {
	minutes := int(seconds) / 60
	secs := int(seconds) % 60
	return fmt.Sprintf("%d:%02d", minutes, secs)
}

// ParseDurationString converts a "MM:SS" or "HH:MM:SS" string to milliseconds.
func ParseDurationString(durationStr string) int64 {
	parts := strings.Split(durationStr, ":")
	var totalSeconds int64

	switch len(parts) {
	case 1: // seconds
		seconds, err := strconv.ParseInt(parts[0], 10, 64)
		if err != nil {
			return 0
		}
		totalSeconds = seconds
	case 2: // MM:SS
		minutes, err := strconv.ParseInt(parts[0], 10, 64)
		if err != nil {
			return 0
		}
		seconds, err := strconv.ParseInt(parts[1], 10, 64)
		if err != nil {
			return 0
		}
		totalSeconds = minutes*60 + seconds
	case 3: // HH:MM:SS
		hours, err := strconv.ParseInt(parts[0], 10, 64)
		if err != nil {
			return 0
		}
		minutes, err := strconv.ParseInt(parts[1], 10, 64)
		if err != nil {
			return 0
		}
		seconds, err := strconv.ParseInt(parts[2], 10, 64)
		if err != nil {
			return 0
		}
		totalSeconds = hours*3600 + minutes*60 + seconds
	default:
		return 0
	}

	return totalSeconds * 1000
}