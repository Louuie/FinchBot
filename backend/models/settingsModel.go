package models


type SongQueueSettings struct {
	Channel       string    `json:"channel,omitempty"`
	Status    bool `json:"status,omitempty"`
	SongLimit   int `json:"song_limit,omitempty"`
	UserLimit   int `json:"user_limit,omitempty"`
}