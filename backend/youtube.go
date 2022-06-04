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
	}()
	return <-songSearchChan
}

func getVideoDuration(videoId string) float64 {
	videoDurationChan := make(chan float64)
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
		songIdDuration := string([]rune(songID.Items[0].ContentDetails.Duration)[2:8])
		songIdDuration = strings.Replace(songIdDuration, "M", "m", 1)
		songIdDuration = strings.Replace(songIdDuration, "S", "s", 1)
		songIdDuration = strings.Replace(songIdDuration, "\x00", "", 1)
		songDuration, err := time.ParseDuration(songIdDuration)
		if err != nil {
			log.Fatalln(err)
		}
		videoDurationChan <- songDuration.Seconds()
		close(videoDurationChan)
	}()
	return <-videoDurationChan
}

func youtubeMiddleware(c *gin.Context) {
	query, exists := c.GetQuery("q")
	if !exists {
		c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error": "Missing Query Parameter!!!",
		})
		return
	}
	songData := getSongFromSearch(query)
	songDuration := getVideoDuration(songData.Items[0].ID.VideoID)
	song := Song{
		Title:    songData.Items[0].Snippet.Title,
		Artist:   songData.Items[0].Snippet.ChannelTitle,
		Duration: songDuration,
		VideoID:  songData.Items[0].ID.VideoID,
	}

	insertSong(song)
	// if(erro != nil) {
	// 	c.JSON(http.StatusBadRequest, map[string]interface{}{
	// 		"error": erro,
	// 	})
	// }

	c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Successfully inserted Song document  into the database!",
	})
}
