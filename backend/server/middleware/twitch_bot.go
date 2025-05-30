package middleware

import (
	"backend/twitch-bot/database"
	"backend/twitch-bot/models"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gorilla/websocket"
)

func JoinChannel(c *fiber.Ctx) error {
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
		return c.Status(fiber.StatusBadRequest).JSON(clientData)
	}
	// Connect to the WebSocket server
	ws, _, err := websocket.DefaultDialer.Dial("wss://bot.finchbot.xyz/ws", nil)
	if err != nil {
		log.Println("WebSocket dial error:", err)
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	defer ws.Close()

	// Send the message
	err = ws.WriteMessage(websocket.TextMessage, []byte("FINCHBOT_WS #"+query.Channel))
	if err != nil {
		log.Println("Write error:", err)
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Read confirmation from the bot server
	_, msg, err := ws.ReadMessage()
	if err != nil {
		log.Println("Read error:", err)
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	log.Printf("WS response: %s", string(msg))

	// Insert the channel into the table/db
	db, err := database.InitializeSongDBConnection()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	insert_err := database.InsertTwitchChannel(query.Channel, db)
	if insert_err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": insert_err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "joined " + query.Channel,
	})
}

func PartChannel(c *fiber.Ctx) error {
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
	// Connect to the WebSocket server
	ws, _, err := websocket.DefaultDialer.Dial("wss://bot.finchbot.xyz/ws", nil)
	if err != nil {
		log.Println("WebSocket dial error:", err)
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	defer ws.Close()

	// Send the message
	err = ws.WriteMessage(websocket.TextMessage, []byte("FINCHBOT_WS part #"+query.Channel))
	if err != nil {
		log.Println("Write error:", err)
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "parted " + query.Channel,
	})
}

func GetAllJoinedTwitchChannels(c *fiber.Ctx) error {
	// Initalize the connection with the database
	db, dbErr := database.InitializeSongDBConnection()
	if dbErr != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": dbErr.Error(),
		})
	}
	channels, err := database.GetTwitchChannels(db)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"channels": channels,
	})
}
