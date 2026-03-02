package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"twitch-bot/models"
)

func AddSong(query string, channel string, username string) (*models.AddSongResponse, error) {
	client := http.Client{}
	req, err := http.NewRequest("GET", "https://api.finchbot.xyz/song-request", nil)
	if err != nil {
		return nil, err
	}
	fmt.Printf("channel: %s", channel)
	// Set the query
	q := req.URL.Query()
	q.Add("q", query)
	q.Add("channel", channel[1:])
	q.Add("user", username)
	req.URL.RawQuery = q.Encode()

	// Get the response
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var addSongResponse models.AddSongResponse
	json.Unmarshal(body, &addSongResponse)

	// Check if the song was successfully added
	if addSongResponse.Status == "success" {
		return &addSongResponse, nil
	} else {
		return nil, fmt.Errorf("error adding song: %s", addSongResponse.Message)
	}

}

func PromoteSong(position string) (*models.PromoteSongResponse, error) {
	// Create the client
	client := http.Client{}
	// get the request
	req, err := http.NewRequest("POST", "https://api.finchbot.xyz/promote-song", nil)
	if err != nil {
		return nil, err
	}
	q := req.URL.Query()
	q.Add("channel", "Louiee_tv")
	q.Add("position", position)
	req.URL.RawQuery = q.Encode()
	// get the response from the request
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var promoteSongResponse models.PromoteSongResponse
	json.Unmarshal(body, &promoteSongResponse)
	if resp.StatusCode == 200 {
		return &promoteSongResponse, nil
	}
	return nil, errors.New("failed to promote the song")
}
