package main

import (
	"backend/twitch-bot/database"
	"backend/twitch-bot/models"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"runtime"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

// TODO: Add better commenting for better overall code reading and understandability

type Duration struct {
	Duration     float64
	isLiveStream bool
}

func parseTime(duration string) float64 {
	parseTimeChan := make(chan float64)
	go func() {
		log.Println(duration)
		formattedTime := strings.Replace(duration, "\x00", "", 1)
		songDuration, err := time.ParseDuration(formattedTime)
		if err != nil {
			log.Fatalln(err)
		}
		parseTimeChan <- songDuration.Seconds()
		close(parseTimeChan)
	}()
	return <-parseTimeChan
}

func getSongFromSearch(query string) models.YouTubeSearch {
	songSearchChan := make(chan models.YouTubeSearch)
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

		var youtubeResponse models.YouTubeSearch
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

		var songID models.VideoDuration
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
		songDuration := parseTime(songIdDuration)
		duration := Duration{
			Duration:     songDuration,
			isLiveStream: false,
		}
		videoDurationChan <- duration
		close(videoDurationChan)
	}()
	return <-videoDurationChan
}

func youtubeMiddleware(c *fiber.Ctx) error {
	runtime.GOMAXPROCS(4)
	type Query struct {
		Channel string `query:"channel"`
		User    string `query:"user"`
		Q       string `query:"q"`
	}
	query := new(Query)

	if err := c.QueryParser(query); err != nil {
		return c.JSON(&fiber.Map{
			"error": err,
		})
	}
	if query.Q == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing query",
			Data: []models.Data{
				{Name: "null", Artist: "null", Duration: 0, Position: 0},
			},
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	if query.User == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing user",
			Data: []models.Data{
				{Name: "null", Artist: "null", Duration: 0, Position: 0},
			},
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	if query.Channel == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing channel",
			Data: []models.Data{
				{Name: "null", Artist: "null", Duration: 0, Position: 0},
			},
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	songData := getSongFromSearch(query.Q)
	songData.Items[0].Snippet.Title = strings.ReplaceAll(songData.Items[0].Snippet.Title, "&amp;", "")

	songDuration := getVideoDuration(songData.Items[0].ID.VideoID)
	if songDuration.isLiveStream {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "a livestream",
			Data: []models.Data{
				{Name: "null", Artist: "null", Duration: 0, Position: 0},
			},
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	if songDuration.Duration >= 600 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "10 minutes or longer",
			Data: []models.Data{
				{Name: "null", Artist: "null", Duration: 0, Position: 0},
			},
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	dbRes := database.CreateTable(query.Channel)
	latestSongPos := database.GetLatestSongPosition(dbRes.DB, dbRes.Channel)
	if latestSongPos >= 20 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "the song queue is full!",
			Data: []models.Data{
				{Name: "null", Artist: "null", Duration: 0, Position: 0},
			},
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	song := database.ClientSong{
		User:     query.User,
		Channel:  query.Channel,
		Title:    songData.Items[0].Snippet.Title,
		Artist:   songData.Items[0].Snippet.ChannelTitle,
		Duration: songDuration.Duration,
		VideoID:  songData.Items[0].ID.VideoID,
		Position: latestSongPos + 1,
	}

	dataError := database.InsertSong(dbRes.DB, song, dbRes.Channel)
	if dataError != "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: dataError,
			Data: []models.Data{
				{Name: "null", Artist: "null", Duration: 0, Position: 0},
			},
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	clientData := models.ClientData{
		Status:  "success",
		Message: "inserted into db",
		Data: []models.Data{
			{Name: song.Title, Artist: song.Artist, Duration: song.Duration, Position: latestSongPos + 1},
		},
	}
	//insertSong(song)
	return c.JSON(clientData)
}
