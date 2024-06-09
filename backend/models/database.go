package models

type SongQuery struct {
	Id                int     `pg:"id,omitempty"`
	Title             string  `pg:"title,omitempty"`
	Artist            string  `pg:"artist,omitempty"`
	Userid            string  `pg:"userid,omitempty"`
	FormattedDuration string  `pg:"formatted_duration,omitempty"`
	DurationInSeconds float64 `pg:"duration_in_seconds,omitempty"`
	Videoid           string  `pg:"videoid,omitempty"`
}

type SongQueueSettingsQuery struct {
	Channel   string `pg:"channel,omitempty"`
	Status    bool   `pg:"status,omitempty"`
	SongLimit int    `pg:"song_limit,omitempty"`
	UserLimit int    `pg:"user_limit,omitempty"`
}

type SongQueueSettingsQueryResponse struct {
	Channel   string `json:"channel,omitempty"`
	Status    bool   `json:"status,omitempty"`
	SongLimit int    `json:"song_limit,omitempty"`
	UserLimit int    `json:"user_limit,omitempty"`
}
