package middleware

import (
	"backend/twitch-bot/api"
	"log"

	"github.com/gofiber/fiber/v2"
)








func TwitchAuth(c *fiber.Ctx) error{
	type Query struct {
		Code string `query:"code"`
	}

	query := new(Query)

	if err := c.QueryParser(query); err != nil {
		log.Fatalln(err)
	}
	if query.Code == "" {
		return c.JSON(&fiber.Map{
			"error": "missing code",
		})
	}

	twitchData, err := api.GetAccessToken(query.Code)
	if err != nil {
		return c.JSON(&fiber.Map{
			"error": err,
		})
	}
	if twitchData.Status != 0 {
		return c.JSON(&fiber.Map{
			"error": twitchData.Message,
		})
	}
	return c.JSON(twitchData)
}