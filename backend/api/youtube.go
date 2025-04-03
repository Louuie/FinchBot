package api

import (
	"backend/twitch-bot/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
)

// TODO: Add better commenting for better overall code reading and understandability

type Duration struct {
	Duration          string
	DurationInSeconds float64
	IsLiveStream      bool
}

// ParseISO8601Duration parses ISO 8601 durations like "PT3M20S", "PT46S", "PT1H2M30S"
func ParseISO8601Duration(duration string) (string, float64) {
	re := regexp.MustCompile(`PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?`)
	matches := re.FindStringSubmatch(duration)

	// SAFETY CHECK
	if matches == nil || len(matches) < 4 {
		// Return fallback values, or panic with useful error
		return "Invalid duration", 0.0
	}

	hours := 0
	minutes := 0
	seconds := 0

	if matches[1] != "" {
		hours, _ = strconv.Atoi(matches[1])
	}
	if matches[2] != "" {
		minutes, _ = strconv.Atoi(matches[2])
	}
	if matches[3] != "" {
		seconds, _ = strconv.Atoi(matches[3])
	}

	totalSeconds := hours*3600 + minutes*60 + seconds
	durationStr := fmt.Sprintf("%02dh:%02dm:%02ds", hours, minutes, seconds)

	return durationStr, float64(totalSeconds)
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
		songDuration, songDurationInSeconds := ParseISO8601Duration(songIdDuration)
		duration := Duration{
			Duration:          songDuration,
			DurationInSeconds: songDurationInSeconds,
			IsLiveStream:      false,
		}
		videoDurationChan <- &duration
		close(videoDurationChan)
	}()
	return <-videoDurationChan
}
