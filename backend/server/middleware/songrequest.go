package middleware

import (
	"backend/twitch-bot/api"
	"backend/twitch-bot/database"
	"backend/twitch-bot/models"
	"log"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// Middleware SongRequest
func SongRequest(c *fiber.Ctx) error {
	// Creates a Query Struct for the query parameters the GET request will take in
	type Query struct {
		Channel string `query:"channel"`
		User    string `query:"user"`
		Q       string `query:"q"`
	}
	query := new(Query)

	if err := c.QueryParser(query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": err,
		})
	}
	// Checks if query is empty if it is then return back to the request that the query is missing
	if query.Q == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing query",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	// Checks if user is empty if it is then return back to the request that the user is missing
	if query.User == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing user",
			Data:    nil,
		}
		return c.Status(fiber.StatusOK).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	// Checks if channel is empty if it is then return back to the request that the channel is missing
	if query.Channel == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing channel",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	// Gets the songData from the youtube api using the query q(uery) from the request
	songData := api.GetSongFromSearch(query.Q)
	if songData.PageInfo.TotalResults == 0 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "No results for that name/link",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	// Gets the duration of the video using the videoID, we have to make separate API calls here because the search api doesn't return the video duration
	songDuration := api.GetVideoDuration(songData.Items[0].ID.VideoID)
	if songDuration.IsLiveStream {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "Livestreams cannot be added to the song queue",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	if songDuration.DurationInSeconds >= 600 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "The video/song is 10 minutes or longer",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	// Makes the initial DB connection and attempts to create the table
	db, dbConnErr := database.InitializeSongDBConnection()
	if dbConnErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": dbConnErr.Error(),
		})
	}
	err := database.CreateSongTable(query.Channel, db)
	if err != nil {
		log.Fatalln(err)
	}

	// Attempts to check if the user has already entered two songs/videos into the queue
	multipleEntries, err := database.GetMultipleEntries(query.Channel, query.User, db)
	if multipleEntries {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "You can only request two songs per user",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": err.Error(),
		})
	}

	// TODO: Figure out a way instead of "getting the latestSongPos" instead change this to fetch all the songs, then check the length, and if the length is greater than 20 than give this error, instead of checking for latestSongPos.

	// Attempts to get the latestSongPosition
	latestSongPos, err := database.GetLatestSongPosition(db, query.Channel)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": err.Error(),
		})
	}

	songs, _, err := database.GetAllSongRequests(query.Channel, db)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": err.Error(),
		})
	}

	if len(*songs) >= 20 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "The song queue is full!",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	song := database.ClientSong{
		User:              query.User,
		Channel:           query.Channel,
		Title:             strings.Replace(songData.Items[0].Snippet.Title, "amp;", "", 1),
		Artist:            songData.Items[0].Snippet.ChannelTitle,
		FormattedDuration: songDuration.Duration,
		DurationInSeconds: songDuration.DurationInSeconds,
		VideoID:           songData.Items[0].ID.VideoID,
		Position:          latestSongPos + 1,
	}

	// if the table is being created for the first time, the GetLatestSongPosition function can't query through because it thinks that the table was never created so it throws a pq error of undefined_table
	// so we catch this error and if we do get the "undefined_table" error then create the table "again"(even though it was never created) then insert it
	if err != nil {
		err := database.CreateSongTable(query.Channel, db)
		if err != nil {
			c.Next()
		}
	}

	dataError := database.InsertSong(db, song, query.Channel)
	if dataError != nil {
		clientData := models.ClientData{
			Status:  "fail",
			Message: dataError.Error(),
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	clientData := models.ClientData{
		Status:  "success",
		Message: "inserted into db",
		Data: []models.Data{
			{Name: song.Title, Artist: song.Artist, FormattedDuration: song.FormattedDuration, DurationInSeconds: song.DurationInSeconds, Position: latestSongPos + 1},
		},
	}
	//insertSong(song)
	return c.Status(fiber.StatusOK).JSON(clientData)
}

// Middleware function that returns all the songs in that current table.
func FetchAllSongs(c *fiber.Ctx) error {
	type Query struct {
		Channel string `query:"channel"`
	}
	query := new(Query)
	if err := c.QueryParser(query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": err,
		})
	}
	if query.Channel == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing channel",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}
	db, dbConnErr := database.InitializeSongDBConnection()
	if dbConnErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": dbConnErr.Error(),
		})
	}
	songs, songReqDB, err := database.GetAllSongRequests(query.Channel, db)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	songReqDB.Close()
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"songs": songs,
	})
}

// Middleware function that deletes the song based of the id passed in the request query.
func DeleteSong(c *fiber.Ctx) error {
	type Query struct {
		Channel string `query:"channel"`
		Id      int    `query:"id"`
	}
	q := new(Query)
	if err := c.QueryParser(q); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": err,
		})
	}
	if q.Id == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": "missing song id",
		})
	}
	if q.Channel == "" {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": "missing channel to delete the song from",
		})
	}
	db, dbConnErr := database.InitializeSongDBConnection()
	if dbConnErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": dbConnErr.Error(),
		})
	}
	err := database.DeleteSong(q.Channel, q.Id, db)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(&fiber.Map{
		"message": "successfully deleted the song with an id of " + strconv.Itoa(q.Id) + " from channel " + q.Channel,
	})
}

func DeleteAllSongs(c *fiber.Ctx) error {
	type Query struct {
		Channel string `query:"channel"`
	}
	q := new(Query)
	if err := c.QueryParser(q); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": err,
		})
	}
	if q.Channel == "" {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": "missing channel to delete all songs from",
		})
	}

	db, dbConnErr := database.InitializeSongDBConnection()
	if dbConnErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": dbConnErr.Error(),
		})
	}

	dbExecErr := database.DeleteAllSongs(q.Channel, db)
	if dbExecErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": dbExecErr.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(&fiber.Map{
		"message": "successfully deleted all songs from channel " + q.Channel,
	})

}

// Middleware function that moves the Song/Video up in the queue.
func PromoteSong(c *fiber.Ctx) error {
	type Query struct {
		Channel   string `query:"channel"`
		Title     string `query:"title"`
		Position1 int    `query:"position1"`
		Position2 int    `query:"position2"`
	}
	q := new(Query)
	if err := c.QueryParser(q); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": err,
		})
	}
	if q.Position1 == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": "missing song id",
		})
	}
	if q.Position2 == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": "missing song id",
		})
	}
	if q.Channel == "" {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": "missing channel to delete the song from",
		})
	}
	if q.Title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": "missing channel to delete the song from",
		})
	}
	db, dbConnErr := database.InitializeSongDBConnection()
	if dbConnErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": dbConnErr.Error(),
		})
	}
	err := database.PromoteSong(q.Channel, q.Position1, q.Position2, q.Title, db)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(&fiber.Map{
		"message": "Check console for message!",
	})

}
