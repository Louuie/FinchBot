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
	req, err := http.NewRequest("GET", "https://finchbot.netlify.app/song-request", nil)
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
