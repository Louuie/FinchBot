package middleware

import (
	"backend/twitch-bot/api"
	"backend/twitch-bot/database"
	"backend/twitch-bot/models"
	"runtime"
	"strconv"
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
			Data:    nil,
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	if query.User == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing user",
			Data:    nil,
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	if query.Channel == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing channel",
			Data:    nil,
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	songData := api.GetSongFromSearch(query.Q)
	if songData.PageInfo.TotalResults == 0 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "No results for that name/link",
			Data:    nil,
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	songData.Items[0].Snippet.Title = strings.ReplaceAll(songData.Items[0].Snippet.Title, "&amp;", "&")
	//songData.Items[0].Snippet.Title = strings.ReplaceAll(songData.Items[0].Snippet.Title, "&#39;", "'")
	songDuration := api.GetVideoDuration(songData.Items[0].ID.VideoID)
	if songDuration.IsLiveStream {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "Livestreams cannot be added to the song queue",
			Data:    nil,
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	if songDuration.Duration >= 600 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "The video/song is 10 minutes or longer",
			Data:    nil,
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	db := database.InitializeConnection()
	database.CreateTable(query.Channel, db)
	latestSongPos := database.GetLatestSongPosition(db, query.Channel)
	if latestSongPos >= 20 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "The song queue is full!",
			Data:    nil,
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

	dataError := database.InsertSong(db, song, query.Channel)
	if dataError != "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: dataError,
			Data:    nil,
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

func FetchAllSongs(c *fiber.Ctx) error {
	type Query struct {
		Channel string `query:"channel"`
	}
	query := new(Query)
	if err := c.QueryParser(query); err != nil {
		return c.JSON(&fiber.Map{
			"error": err,
		})
	}
	if query.Channel == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing channel",
			Data:    nil,
		}
		return c.JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	db := database.InitializeConnection()
	songs, err := database.GetAllSongRequests(query.Channel, db)
	if err != nil {
		return c.JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"songs": songs,
	})
}

func DeleteSong(c *fiber.Ctx) error {
	type Query struct {
		Channel string `query:"channel"`
		Id      int    `query:"id"`
	}
	q := new(Query)
	if err := c.QueryParser(q); err != nil {
		return c.JSON(&fiber.Map{
			"error": err,
		})
	}
	if q.Id == 0 {
		return c.JSON(&fiber.Map{
			"error": "missing song id",
		})
	}
	if q.Channel == "" {
		return c.JSON(&fiber.Map{
			"error": "missing channel to delete the song from",
		})
	}
	db := database.InitializeConnection()
	err := database.DeleteSong(q.Channel, q.Id, db)
	if err != nil {
		return c.JSON(&fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(&fiber.Map{
		"message": "successfully deleted the song with an id of " + strconv.Itoa(q.Id) + " from channel " + q.Channel,
	})
}
