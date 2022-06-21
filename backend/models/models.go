package models

import (
	"time"
)

type YouTubeSearch struct {
	Kind          string `firestore:"kind,omitempty"`
	Etag          string `firestore:"etag,omitempty"`
	NextPageToken string `firestore:"nextPageToken,omitempty"`
	RegionCode    string `firestore:"regionCode,omitempty"`
	PageInfo      struct {
		TotalResults   int `firestore:"totalResults,omitempty"`
		ResultsPerPage int `firestore:"resultsPerPage,omitempty"`
	} `firestore:"pageInfo,omitempty"`
	Items []struct {
		Kind string `firestore:"kind,omitempty"`
		Etag string `firestore:"etag,omitempty"`
		ID   struct {
			Kind    string `firestore:"kind,omitempty"`
			VideoID string `firestore:"videoId,omitempty"`
		} `firestore:"id"`
		Snippet struct {
			PublishedAt time.Time `firestore:"publishedAt,omitempty"`
			ChannelID   string    `firestore:"channelId,omitempty"`
			Title       string    `firestore:"title,omitempty"`
			Description string    `firestore:"description,omitempty"`
			Thumbnails  struct {
				Default struct {
					URL    string `firestore:"url,omitempty"`
					Width  int    `firestore:"width,omitempty"`
					Height int    `firestore:"height,omitempty"`
				} `firestore:"default,omitempty"`
				Medium struct {
					URL    string `firestore:"url,omitempty"`
					Width  int    `firestore:"width,omitempty"`
					Height int    `firestore:"height,omitempty"`
				} `firestore:"medium,omitempty"`
				High struct {
					URL    string `firestore:"url,omitempty"`
					Width  int    `firestore:"width,omitempty"`
					Height int    `firestore:"height,omitempty"`
				} `firestore:"high,omitempty"`
			} `firestore:"thumbnails,omitempty"`
			ChannelTitle         string    `firestore:"channelTitle,omitempty"`
			LiveBroadcastContent string    `firestore:"liveBroadcastContent,omitempty"`
			PublishTime          time.Time `firestore:"publishTime,omitempty"`
		} `firestore:"snippet,omitempty"`
	} `firestore:"items,omitempty"`
}

type VideoDuration struct {
	Kind  string `json:"king,omitempty"`
	Etag  string `json:"etag,omitempty"`
	Items []struct {
		Kind           string `json:"king,omitempty"`
		Etag           string `json:"etag,omitempty"`
		ID             string `json:"id,omitempty"`
		ContentDetails struct {
			Duration        string `json:"duration,omitempty"`
			Dimension       string `json:"dimension,omitempty"`
			Definition      string `json:"definition,omitempty"`
			Caption         string `json:"caption,omitempty"`
			LicensedContent string `json:"licensedcontent,omitempty"`
			ContentRating   struct{}
			Projection      string `json:"projection,omitempty"`
		}
	}
	PageInfo struct {
		TotalResults   int `firestore:"totalResults,omitempty"`
		ResultsPerPage int `firestore:"resultsPerPage,omitempty"`
	} `firestore:"pageInfo,omitempty"`
}

type Song struct {
	User     string  `firestore:"user,omitempty"`
	Title    string  `firestore:"title,omitempty"`
	Artist   string  `firestore:"artist,omitempty"`
	Duration float64 `firestore:"duration,omitempty"`
	VideoID  string  `firestore:"videoid,omitempty"`
	Position float64 `firestore:"position,omitempty"`
}

type Data struct {
	Name     string  `json:"name,omitempty"`
	Artist   string  `json:"artist,omitempty"`
	Duration float64 `json:"duration,omitempty"`
	Position int     `json:"position,omitempty"`
}
type ClientData struct {
	Status  string `json:"status,omitempty"`
	Message string `json:"message,omitempty"`
	Data    []Data `json:"data,omitempty"`
}

type SongPosition struct {
	Location     float64 `json:"location,omitempty"`
	IteratorDone bool    `json:"iteratordone,omitempty"`
}

type DatabaseQuery struct {
	Artist   string `json:"artist,omitempty"`
	Duration int    `json:"duration,omitempty"`
	Id       int    `json:"id,omitempty"`
	Title    string `json:"title,omitempty"`
	Userid   string `json:"userid,omitempty"`
	Videoid  string `json:"videoid,omitempty"`
}





type TwitchAuthResponse struct {
	AccessToken  string    `json:"access_token,omitempty"`
	ExpiresIn    float64   `json:"expires_in,omitempty"`
	RefreshToken string    `json:"refresh_token,omitempty"`
	Scope        []string  `json:"scope,omitempty"`
	TokenType    string    `json:"token_type,omitempty"`
	Status 		 float64   `json:"status,omitempty"`
	Message 	 string    `json:"message,omitempty"` 
}



type TwitchUserInfoResponse struct {
	Data []struct {
		ID              string    `json:"id"`
		Login           string    `json:"login"`
		DisplayName     string    `json:"display_name"`
		Type            string    `json:"type"`
		BroadcasterType string    `json:"broadcaster_type"`
		Description     string    `json:"description"`
		ProfileImageURL string    `json:"profile_image_url"`
		OfflineImageURL string    `json:"offline_image_url"`
		ViewCount       int       `json:"view_count"`
		Email           string    `json:"email"`
		CreatedAt       time.Time `json:"created_at"`
	} `json:"data"`
}


type TwitchValidateTokenResponse struct {
	ClientID  string   `json:"client_id"`
	Login     string   `json:"login"`
	Scopes    []string `json:"scopes"`
	UserID    string   `json:"user_id"`
	ExpiresIn int      `json:"expires_in"`
}



type TwitchRevokeTokenResponse struct {
	Status int `json:"status"`
	Message string `json:"message"`
}