package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// TODO: Add better commenting for better overall code reading and understandability

type Duration struct {
	Duration     float64
	isLiveStream bool
}

func getSongFromSearch(query string) YouTubeSearch {
	songSearchChan := make(chan YouTubeSearch)
	go func() {
		url := "https://www.googleapis.com/youtube/v3/search"
		client := http.Client{}
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			log.Fatalln(err)
		}
		q := req.URL.Query()
		q.Add("key", os.Getenv("GOOGLE_API_KEY"))
		q.Add("part", "snippet")
		q.Add("maxResults", "1")
		q.Add("q", query)
		req.URL.RawQuery = q.Encode()

		resp, err := client.Do(req)
		if err != nil {
			log.Fatalln(err)
		}

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatalln(err)
		}

		var youtubeResponse YouTubeSearch
		json.Unmarshal(body, &youtubeResponse)
		songSearchChan <- youtubeResponse
		close(songSearchChan)
	}()
	return <-songSearchChan
}

func getVideoDuration(videoId string) Duration {
	videoDurationChan := make(chan Duration)
	go func() {
		url := "https://www.googleapis.com/youtube/v3/videos"
		client := http.Client{}
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			log.Fatalln(err)
		}
		q := req.URL.Query()
		q.Add("id", videoId)
		q.Add("part", "contentDetails")
		q.Add("key", os.Getenv("GOOGLE_API_KEY"))
		req.URL.RawQuery = q.Encode()

		resp, err := client.Do(req)
		if err != nil {
			log.Fatalln(err)
		}

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatalln(err)
		}

		var songID VideoDuration
		json.Unmarshal(body, &songID)
		if songID.Items[0].ContentDetails.Duration == "P0D" {
			duration := Duration{
				Duration:     0,
				isLiveStream: true,
			}
			videoDurationChan <- duration
			close(videoDurationChan)
			return
		}
		songIdDuration := string([]rune(songID.Items[0].ContentDetails.Duration)[2:8])
		songIdDuration = strings.Replace(songIdDuration, "M", "m", 1)
		songIdDuration = strings.Replace(songIdDuration, "S", "s", 1)
		songIdDuration = strings.Replace(songIdDuration, "\x00", "", 1)
		songDuration, err := time.ParseDuration(songIdDuration)
		if err != nil {
			log.Fatalln(err)
		}
		duration := Duration{
			Duration:     songDuration.Seconds(),
			isLiveStream: false,
		}
		videoDurationChan <- duration
		close(videoDurationChan)
	}()
	return <-videoDurationChan
}

func youtubeMiddleware(c *gin.Context) {
	clientDataChan := make(chan ClientData)
	go func() {
		channel, channelExists := c.GetQuery("channel")
		if !channelExists {
			clientData := ClientData{
				Status:  "fail",
				Message: "missing channel",
				Data: []Data{
					{"null", "null", 0},
				},
			}
			clientDataChan <- clientData
			close(clientDataChan)
			return
		}
		user, userExists := c.GetQuery("user")
		if !userExists {
			clientData := ClientData{
				Status:  "fail",
				Message: "missing user",
				Data: []Data{
					{"null", "null", 0},
				},
			}
			clientDataChan <- clientData
			close(clientDataChan)
			return
		}
		query, qExists := c.GetQuery("q")
		if !qExists {
			clientData := ClientData{
				Status:  "fail",
				Message: "missing query",
				Data: []Data{
					{"null", "null", 0},
				},
			}
			clientDataChan <- clientData
			close(clientDataChan)
			return
		}

		songData := getSongFromSearch(query)
		songDuration := getVideoDuration(songData.Items[0].ID.VideoID)
		if songDuration.isLiveStream {
			clientData := ClientData{
				Status:  "fail",
				Message: "a livestream",
				Data: []Data{
					{"null", "null", 0},
				},
			}
			clientDataChan <- clientData
			close(clientDataChan)
			return
		}
		if songDuration.Duration >= 600 {
			clientData := ClientData{
				Status:  "fail",
				Message: "10 minutes or longer",
				Data: []Data{
					{"null", "null", 0},
				},
			}
			clientDataChan <- clientData
			close(clientDataChan)
			return
		}

		song := ClientSong{
			User:     user,
			Channel:  channel,
			Title:    songData.Items[0].Snippet.Title,
			Artist:   songData.Items[0].Snippet.ChannelTitle,
			Duration: songDuration.Duration,
			VideoID:  songData.Items[0].ID.VideoID,
			Position: 1,
		}

		insertSong(song)

		clientData := ClientData{
			Status:  "success",
			Message: "inserted into db",
			Data: []Data{
				{song.Title, song.Artist, song.Duration},
			},
		}
		clientDataChan <- clientData
		close(clientDataChan)
	}()

	clientData := <-clientDataChan

	if clientData.Message == "missing channel" {
		c.JSON(http.StatusOK, map[string]interface{}{
			"error": clientData.Message,
		})
		return
	}

	if clientData.Message == "missing query" {
		c.JSON(http.StatusOK, map[string]interface{}{
			"error": clientData.Message,
		})
		return
	}

	if clientData.Message == "missing user" {
		c.JSON(http.StatusOK, map[string]interface{}{
			"error": clientData.Message,
		})
		return
	}

	if clientData.Message == "a livestream" {
		c.JSON(http.StatusOK, map[string]interface{}{
			"error": clientData.Message,
		})
		return
	}

	if clientData.Message == "10 minutes or longer" {
		c.JSON(http.StatusOK, map[string]interface{}{
			"error": clientData.Message,
		})
		return
	}

	c.JSON(http.StatusOK, clientData)
}
