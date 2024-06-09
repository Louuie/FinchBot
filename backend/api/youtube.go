package api

import (
	"backend/twitch-bot/models"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// TODO: Add better commenting for better overall code reading and understandability

type Duration struct {
	Duration     string
	DurationInSeconds float64
	IsLiveStream bool
}

func ParseTime(duration string) (string, float64) {
	formattedTime := strings.Replace(duration, "\x00", "", 1)
	formattedTime2 := strings.Replace(formattedTime, "\x00\x00", "", 1)

	songDuration, err := time.ParseDuration(formattedTime2)
	if err != nil {
		log.Fatalln(err)
	}
	return songDuration.String(), songDuration.Seconds()
}


func GetSongFromSearch(query string) *models.YouTubeSearch {
	songSearchChan := make(chan *models.YouTubeSearch)
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
		songSearchChan <- &youtubeResponse
		close(songSearchChan)
	}()
	return <-songSearchChan
}

func GetVideoDuration(videoId string) *Duration {
	videoDurationChan := make(chan *Duration)
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
				Duration:     "LIVE",
				IsLiveStream: true,
			}
			videoDurationChan <- &duration
			close(videoDurationChan)
			return
		}
		songIdDuration := string([]rune(songID.Items[0].ContentDetails.Duration)[2:8])
		songIdDuration = strings.Replace(songIdDuration, "M", "m", 1)
		songIdDuration = strings.Replace(songIdDuration, "S", "s", 1)
		songIdDuration = strings.Replace(songIdDuration, "\x00", "", 1)
		songDuration, songDurationInSeconds := ParseTime(songIdDuration)
		duration := Duration{
			Duration:     songDuration,
			DurationInSeconds: songDurationInSeconds,
			IsLiveStream: false,
		}
		videoDurationChan <- &duration
		close(videoDurationChan)
	}()
	return <-videoDurationChan
}