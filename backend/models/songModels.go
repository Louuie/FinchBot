package models

type Song struct {
	User     string  `pg:"user,omitempty"`
	Title    string  `pg:"title,omitempty"`
	Artist   string  `pg:"artist,omitempty"`
	Duration float64 `pg:"duration,omitempty"`
	VideoID  string  `pg:"videoid,omitempty"`
	Position float64 `pg:"position,omitempty"`
}

type Data struct {
	Name     string  `json:"name,omitempty"`
	Artist   string  `json:"artist,omitempty"`
	FormattedDuration string `json:"formatted_duration,omitempty"`
	DurationInSeconds float64 `json:"duration_in_seconds,omitempty"`
	Position int     `json:"position,omitempty"`
}
type ClientData struct {
	Status  string `json:"status,omitempty"`
	Message string `json:"message,omitempty"`
	Data    []Data `json:"data,omitempty"`
}

type SongPosition struct {
	Location     float64 `pg:"location,omitempty"`
	IteratorDone bool    `pg:"iteratordone,omitempty"`
}