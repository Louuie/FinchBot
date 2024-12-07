package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"twitch-bot/models"
)

func AddSong(query string) (*models.AddSongResponse, error) {
	client := http.Client{}
	req, err := http.NewRequest("GET", "http://localhost:3030/song-request", nil)
	if err != nil {
		return nil, err
	}

	// Set the query
	q := req.URL.Query()
	q.Add("q", query)
	q.Add("channel", "Louiee_tv")
	q.Add("user", fmt.Sprintf("%v", rand.Int()))
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
		return nil, errors.New("there was an error adding the song")
	}

}

func PromoteSong(title string, position1 string, position2 string) (*models.PromoteSongResponse, error) {
	// Create the client
	client := http.Client{}
	// get the request
	req, err := http.NewRequest("POST", "http://localhost:3030/promote-song", nil)
	if err != nil {
		return nil, err
	}
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
	if promoteSongResponse.Message == "Check console for message!" {
		return &promoteSongResponse, nil
	}
	return nil, errors.New("failed to promote the song")
}
