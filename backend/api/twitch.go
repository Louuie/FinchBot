package api

import (
	"backend/twitch-bot/models"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

// Fetches the Twitch User Access Token.
// Then returns the TwitchAuthResponse.
// The struct of the TwitchAuthResponse can be found below for deconstruction purposes.
// 	type TwitchAuthResponse struct {
//     AccessToken  string
//     ExpiresIn    float64
//     RefreshToken string
//     Scope        []string
//     TokenType    string
//     Status       float64
//     Message      string
// }
func GetAccessToken(code string) (*models.TwitchAuthResponse, error) {
	url := "https://id.twitch.tv/oauth2/token"
	client := http.Client{}
	req, err := http.NewRequest("POST", url, nil)
	if err != nil {
		log.Fatalln(err)
	}
	q := req.URL.Query()
	q.Add("client_id", os.Getenv("TWITCH_CLIENT_ID"))
	q.Add("client_secret", os.Getenv("TWITCH_CLIENT_SECRET"))
	q.Add("code", code)
	q.Add("grant_type", "authorization_code")
	q.Add("redirect_uri", "http://localhost:3000")
	req.URL.RawQuery = q.Encode()

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var twitchAuthRes models.TwitchAuthResponse
	json.Unmarshal(body, &twitchAuthRes)
	return &twitchAuthRes, nil
}

// Validates the users access token to make sure its a valid one, if not it returns an error.
func ValidateAccessToken(token string) error {
	url := "https://id.twitch.tv/oauth2/validate"
	client := http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	var twitchValidateTokenRes models.TwitchValidateTokenResponse
	json.Unmarshal(body, &twitchValidateTokenRes)
	if twitchValidateTokenRes.ExpiresIn == 0 {
		return errors.New("something went wrong validating the token on the backend")
	}
	return nil
}

// Revokes the users access token, returns an error if something went wrong in the proccess of revoking the access token.
func RevokeAccessToken(token string) error {
	url := "https://id.twitch.tv/oauth2/revoke"
	client := http.Client{}
	req, err := http.NewRequest("POST", url, nil)
	q := req.URL.Query()
	q.Add("client_id", os.Getenv("TWITCH_CLIENT_ID"))
	q.Add("token", token)
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	if err != nil {
		return err
	}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	var twitchRevokeTokenRes models.TwitchRevokeTokenResponse
	json.Unmarshal(body, &twitchRevokeTokenRes)
	if twitchRevokeTokenRes.Status == 400 || twitchRevokeTokenRes.Status == 404 {
		return errors.New(twitchRevokeTokenRes.Message)
	}
	return nil
}

// Gets the Users Information.
// Then returns the TwitchUserInfoResponse
// The Struct of the TwitchUserInfoResponse can be found below for deconstruction purposes.
// 	type TwitchUserInfoResponse struct {
// 		Data []struct {
// 			ID              string
// 			Login           string
// 			DisplayName     string
// 			Type            string
// 			BroadcasterType string
// 			Description     string
// 			ProfileImageURL string
// 			OfflineImageURL string
// 			ViewCount       int
// 			Email           string
// 			CreatedAt       time.Time
//	 	}
//	}
func GetUserInfo(token string) (*models.TwitchUserInfoResponse, error) {
	url := "https://api.twitch.tv/helix/users"
	client := http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Add("Client-Id", os.Getenv("TWITCH_CLIENT_ID"))
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var twitchUserInfoResponse models.TwitchUserInfoResponse
	json.Unmarshal(body, &twitchUserInfoResponse)
	return &twitchUserInfoResponse, nil
}

func ModifyBroadcastInformation(token string, broadcaster_id string, modifyModel *models.ModifyChannel) error {
	url := "https://api.twitch.tv/helix/channels"
	client := http.Client{}
	// IF THE USER DOES NOT PASS A GAME. JUST SET THE TITLE
	if modifyModel.GameID == "" {
		config := fmt.Sprintf(`{
			"title": "%s"
		}`, modifyModel.Title)
		var jsonData = []byte(config)
		req, err := http.NewRequest("PATCH", url, bytes.NewBuffer(jsonData))
		if err != nil {
			return err
		}
		q := req.URL.Query()
		q.Add("broadcaster_id", broadcaster_id)
		req.URL.RawQuery = q.Encode()
		req.Header.Add("Authorization", "Bearer "+token)
		req.Header.Add("Client-Id", os.Getenv("TWITCH_CLIENT_ID"))
		req.Header.Add("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			return err
		}
		if resp.StatusCode != 204 {
			return errors.New("Something went wrong! " + resp.Status)
		}
		return nil
	}
	// IF THE USER PASSES UNLISTED THEN SET THE GAME TO NULL/UNLISTED.
	if modifyModel.GameID == "unlisted" && modifyModel.Title == "" {
		config := `{
			"game_id": ""
		}`
		var jsonData = []byte(config)
		req, err := http.NewRequest("PATCH", url, bytes.NewBuffer(jsonData))
		if err != nil {
			return err
		}
		q := req.URL.Query()
		q.Add("broadcaster_id", broadcaster_id)
		req.URL.RawQuery = q.Encode()
		req.Header.Add("Authorization", "Bearer "+token)
		req.Header.Add("Client-Id", os.Getenv("TWITCH_CLIENT_ID"))
		req.Header.Add("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			return err
		}
		if resp.StatusCode != 204 {
			return errors.New("Something went wrong! " + resp.Status)
		}
		return nil
	}

	if modifyModel.GameID != "" && modifyModel.Title == "" {
		config := fmt.Sprintf(`{
			"game_id": "%s"
		}`, modifyModel.GameID)
		var jsonData = []byte(config)
		req, err := http.NewRequest("PATCH", url, bytes.NewBuffer(jsonData))
		if err != nil {
			return err
		}
		q := req.URL.Query()
		q.Add("broadcaster_id", broadcaster_id)
		req.URL.RawQuery = q.Encode()
		req.Header.Add("Authorization", "Bearer "+token)
		req.Header.Add("Client-Id", os.Getenv("TWITCH_CLIENT_ID"))
		req.Header.Add("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			return err
		}
		if resp.StatusCode != 204 {
			return errors.New("Something went wrong! " + resp.Status)
		}
		return nil
	}

	config := fmt.Sprintf(`{
		"game_id": "%s",
		"title": "%s"
	}`, modifyModel.GameID, modifyModel.Title)
	var jsonData = []byte(config)
	req, err := http.NewRequest("PATCH", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	q := req.URL.Query()
	q.Add("broadcaster_id", broadcaster_id)
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Add("Client-Id", os.Getenv("TWITCH_CLIENT_ID"))
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	if resp.StatusCode != 204 {
		return errors.New("Something went wrong! " + resp.Status)
	}
	return nil
}

func SearchTwitchCategories(query string, token string) (*models.SearchCategoriesResponse, error) {
	url := "https://api.twitch.tv/helix/search/categories"
	client := http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	q := req.URL.Query()
	q.Add("query", query)
	q.Add("first", "1")
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Add("Client-Id", os.Getenv("TWITCH_CLIENT_ID"))
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var searchCategoriesResponse models.SearchCategoriesResponse
	json.Unmarshal(body, &searchCategoriesResponse)
	return &searchCategoriesResponse, nil
}

func GetCurrentCategory(token string, broadcaster_id string) (*models.CurrentCategoryResponse, error) {
	url := "https://api.twitch.tv/helix/channels"
	client := http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	q := req.URL.Query()
	q.Add("broadcaster_id", broadcaster_id)
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Add("Client-Id", os.Getenv("TWITCH_CLIENT_ID"))

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var currentCategoryResponse models.CurrentCategoryResponse
	json.Unmarshal(body, &currentCategoryResponse)
	return &currentCategoryResponse, nil
}
