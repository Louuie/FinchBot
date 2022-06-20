package api

import (
	"backend/twitch-bot/models"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)


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


func GetUserInfo(token string) (*models.TwitchUserInfoResponse, error) {
	url := "https://api.twitch.tv/helix/users"
	client := http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "Bearer " + token)
	req.Header.Add("Client-Id", os.Getenv("TWITCH_CLIENT_ID"))
	log.Println(req.Header)
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	log.Println(resp.Header)
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var twitchUserInfoResponse models.TwitchUserInfoResponse
	json.Unmarshal(body, &twitchUserInfoResponse)
	return &twitchUserInfoResponse, nil
}