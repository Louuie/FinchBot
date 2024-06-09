package models

import "time"


type YouTubeSearch struct {
	Kind          string `json:"kind,omitempty"`
	Etag          string `json:"etag,omitempty"`
	NextPageToken string `json:"nextPageToken,omitempty"`
	RegionCode    string `json:"regionCode,omitempty"`
	PageInfo      struct {
		TotalResults   int `json:"totalResults,omitempty"`
		ResultsPerPage int `json:"resultsPerPage,omitempty"`
	} `json:"pageInfo,omitempty"`
	Items []struct {
		Kind string `json:"kind,omitempty"`
		Etag string `json:"etag,omitempty"`
		ID   struct {
			Kind    string `json:"kind,omitempty"`
			VideoID string `json:"videoId,omitempty"`
		} `json:"id"`
		Snippet struct {
			PublishedAt time.Time `json:"publishedAt,omitempty"`
			ChannelID   string    `json:"channelId,omitempty"`
			Title       string    `json:"title,omitempty"`
			Description string    `json:"description,omitempty"`
			Thumbnails  struct {
				Default struct {
					URL    string `json:"url,omitempty"`
					Width  int    `json:"width,omitempty"`
					Height int    `json:"height,omitempty"`
				} `json:"default,omitempty"`
				Medium struct {
					URL    string `json:"url,omitempty"`
					Width  int    `json:"width,omitempty"`
					Height int    `json:"height,omitempty"`
				} `json:"medium,omitempty"`
				High struct {
					URL    string `json:"url,omitempty"`
					Width  int    `json:"width,omitempty"`
					Height int    `json:"height,omitempty"`
				} `json:"high,omitempty"`
			} `json:"thumbnails,omitempty"`
			ChannelTitle         string    `json:"channelTitle,omitempty"`
			LiveBroadcastContent string    `json:"liveBroadcastContent,omitempty"`
			PublishTime          time.Time `json:"publishTime,omitempty"`
		} `json:"snippet,omitempty"`
	} `json:"items,omitempty"`
}

type VideoDuration struct {
	Kind  string `pg:"king,omitempty"`
	Etag  string `pg:"etag,omitempty"`
	Items []struct {
		Kind           string `pg:"king,omitempty"`
		Etag           string `pg:"etag,omitempty"`
		ID             string `pg:"id,omitempty"`
		ContentDetails struct {
			Duration        string `pg:"duration,omitempty"`
			Dimension       string `pg:"dimension,omitempty"`
			Definition      string `pg:"definition,omitempty"`
			Caption         string `pg:"caption,omitempty"`
			LicensedContent string `pg:"licensedcontent,omitempty"`
			ContentRating   struct{}
			Projection      string `pg:"projection,omitempty"`
		}
	}
	PageInfo struct {
		TotalResults   int `pg:"totalResults,omitempty"`
		ResultsPerPage int `pg:"resultsPerPage,omitempty"`
	} `pg:"pageInfo,omitempty"`
}