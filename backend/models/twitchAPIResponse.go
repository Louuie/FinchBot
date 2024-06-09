package models

import "time"

type TwitchAuthResponse struct {
	AccessToken  string   `json:"access_token,omitempty"`
	ExpiresIn    float64  `json:"expires_in,omitempty"`
	RefreshToken string   `json:"refresh_token,omitempty"`
	Scope        []string `json:"scope,omitempty"`
	TokenType    string   `json:"token_type,omitempty"`
	Status       float64  `json:"status,omitempty"`
	Message      string   `json:"message,omitempty"`
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
	} `pg:"data"`
}

type TwitchValidateTokenResponse struct {
	ClientID  string   `json:"client_id"`
	Login     string   `json:"login"`
	Scopes    []string `json:"scopes"`
	UserID    string   `json:"user_id"`
	ExpiresIn int      `json:"expires_in"`
}

type TwitchRevokeTokenResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

type ModifyChannel struct {
	GameID     string `json:"game_id"`
	Title      string `json:"title"`
	StreamLang string `json:"broadcaster_language"`
}

type SearchCategoriesResponse struct {
	Data []struct {
		ID        string `json:"id"`
		Name      string `json:"name"`
		BoxArtURL string `json:"box_art_url"`
	} `json:"data"`
	Pagination struct {
		Cursor string `json:"cursor"`
	} `json:"pagination"`
}

type CurrentCategoryResponse struct {
	Data []struct {
		BroadcasterID       string `json:"broadcaster_id"`
		BroadcasterLogin    string `json:"broadcaster_login"`
		BroadcasterName     string `json:"broadcaster_name"`
		BroadcasterLanguage string `json:"broadcaster_language"`
		GameID              string `json:"game_id"`
		GameName            string `json:"game_name"`
		Title               string `json:"title"`
		Delay               int32  `json:"delay"`
	}
}