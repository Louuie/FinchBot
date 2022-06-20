package middleware

import (
	"backend/twitch-bot/api"
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)


var (
	store *session.Store
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
	store = session.New(session.Config{
		CookieHTTPOnly: true,
		Expiration: time.Duration(twitchData.ExpiresIn),

	})
	
	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session)",
		})
	}
	sess.Set("authenticated", true)
	sess.Set("access_token", twitchData.AccessToken)
	sess.Save()
	return c.JSON(twitchData)
}



func TwitchAuthCheck(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session)",
		})
	}
	if sess.Get("authenticated") == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session)",
		})
	}
	return c.Status(fiber.StatusAccepted).JSON(&fiber.Map{
		"authenticated": sess.Get("authenticated"),
		"access_token": sess.Get("access_token"),
	})
}



func TwitchUserInfo(c * fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session)",
		})
	}
	if sess.Get("authenticated") == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session)",
		})
	}
	userInfo, err := api.GetUserInfo(fmt.Sprintf("%v", sess.Get("access_token")))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusAccepted).JSON(userInfo.Data)
}