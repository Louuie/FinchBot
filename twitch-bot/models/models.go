package models

type AddSongResponse struct {
	Status  string `json:"status,omitempty"`
	Message string `json:"message,omitempty"`
	Data    []Data `json:"data,omitempty"`
}

type PromoteSongResponse struct {
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

type Data struct {
	Name              string  `json:"name,omitempty"`
	Artist            string  `json:"artist,omitempty"`
	FormattedDuration string  `json:"formatted_duration,omitempty"`
	DurationInSeconds float64 `json:"duration_in_seconds,omitempty"`
	Position          int     `json:"position,omitempty"`
}
