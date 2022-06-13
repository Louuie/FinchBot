package middleware

import (
	"backend/twitch-bot/api"
	"backend/twitch-bot/database"
	"backend/twitch-bot/models"
	"runtime"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func SongRequest(c *fiber.Ctx) error {
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
	songData := api.GetSongFromSearch(query.Q)
	if songData.PageInfo.ResultsPerPage == 0 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "No results for that name/link",
			Data: []models.Data{
				{Name: "null", Artist: "null", Duration: 0, Position: 0},
			},
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	songData.Items[0].Snippet.Title = strings.ReplaceAll(songData.Items[0].Snippet.Title, "&amp;", "&")

	songDuration := api.GetVideoDuration(songData.Items[0].ID.VideoID)
	if songDuration.IsLiveStream {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "Livestreams cannot be added to the song queue",
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
			Message: "The video/song is 10 minutes or longer",
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
			Message: "The song queue is full!",
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