package middleware

import (
	"backend/twitch-bot/database"
	"backend/twitch-bot/models"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// Middleware that gets the current Song Queue Settings
func GetSongQueueSettings(c *fiber.Ctx) error {
	// Creates a Query Struct for the query parameters the GET request will take in
	type Query struct {
		Channel string `query:"channel"`
	}
	query := new(Query)

	if err := c.QueryParser(query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": err,
		})
	}
	// Checks if query is empty if it is then return back to the request that the query is missing
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

	db, err := database.InitializeSettingsDBConnection()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": err.Error(),
		})
	}

	settings, db, err := database.GetSongQueueSettings(query.Channel, db)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": err.Error(),
		})
	}
	fmt.Println(settings)
	db.Close()
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"settings": settings,
	})

}

// Middleware that sets the Song Queue Settings
func SetSongQueueSettings(c *fiber.Ctx) error {
	// Creates a Query Struct for the query parameters the POST request will take in
	type Query struct {
		Channel         string  `query:"channel"`
		SongQueueStatus string  `query:"song_queue_status"`
		SongLimit       float64 `query:"song_limit"`
		UserLimit       float64 `query:"user_limit"`
	}
	query := new(Query)

	if err := c.QueryParser(query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"error": err,
		})
	}
	// Checks if query is empty if it is then return back to the request that the query is missing
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

	// Checks if query is empty if it is then return back to the request that the query is missing
	if query.SongQueueStatus == "" {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing Song Queue Status",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	// Checks if query is empty if it is then return back to the request that the query is missing
	// if query.SongQueueStatus != "true" || query.SongQueueStatus != "false" {
	// 	clientData := models.ClientData{
	// 		Status:  "fail",
	// 		Message: "please enter a boolean (true or false)",
	// 		Data:    nil,
	// 	}
	// 	return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
	// 		"error": clientData.Message,
	// 	})
	// }

	// Checks if query is empty if it is then return back to the request that the query is missing
	if query.SongLimit == 0 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing Song Limit",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	// Checks if query is empty if it is then return back to the request that the query is missing
	if query.UserLimit == 0 {
		clientData := models.ClientData{
			Status:  "fail",
			Message: "missing User Limit",
			Data:    nil,
		}
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": clientData.Message,
		})
	}

	db, err := database.InitializeSettingsDBConnection()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": err.Error(),
		})
	}

	dbErr := database.CreateSongQueueSettingTable(query.Channel, db)
	if dbErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
			"error": dbErr.Error(),
		})
	}

	if query.SongQueueStatus == "true" {
		err := database.UpdateSongQueueSettings(db, query.Channel, true, query.SongLimit, query.UserLimit)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
				"error": err.Error(),
			})
		}
	} else {
		err := database.UpdateSongQueueSettings(db, query.Channel, false, query.SongLimit, query.UserLimit)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(map[string]interface{}{
				"error": err.Error(),
			})
		}
	}

	return c.Status(fiber.StatusAccepted).JSON(map[string]interface{}{
		"message": "successfully updated Song Queue settings for channel " + query.Channel,
	})

}
