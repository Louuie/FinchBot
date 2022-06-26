package middleware

import (
	"backend/twitch-bot/api"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

// Middleware function used for Authorizing/Logging in the user into Twitch.
func TwitchAuth(c *fiber.Ctx) error {
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

// Middleware function that checks if the user still has a valid access token
func TwitchAuthCheck(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session) some err",
		})
	}
	if sess == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session) sess == nil",
		})
	}
	if sess.Get("authenticated") == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session)",
		})
	}
	token := fmt.Sprintf("%v", sess.Get("access_token"))
	err = api.ValidateAccessToken(token)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": err,
		})
	}

	userInfo, err := api.GetUserInfo(token)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": err,
		})
	}
	return c.Status(fiber.StatusAccepted).JSON(&fiber.Map{
		"authenticated": sess.Get("authenticated"),
		"display_name":  userInfo.Data[0].DisplayName,
	})
}

// Middleware function that revokes the twitch access token and destroys the session
func TwitchAuthRevoke(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session) err != nil",
		})
	}
	if sess == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session) sess == nil",
		})
	}
	if sess.Get("authenticated") == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session) authenticated == nil || access_token == nil",
		})
	}
	err = api.RevokeAccessToken(fmt.Sprintf("%v", sess.Get("access_token")))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": err,
		})
	}
	sess.Destroy()
	return c.Status(fiber.StatusAccepted).JSON(&fiber.Map{
		"authenticated": sess.Get("authenticated"),
		"message":       "logged out",
	})
}

// Middleware function that uses the session data to grab the users twitch information.
func TwitchUserInfo(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session) err != nil",
		})
	}
	if sess == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session) sess == nil",
		})
	}
	if sess.Get("authenticated") == nil || sess.Get("access_token") == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "not authenticated! (couldn't get session) authenticated == nil || access_token == nil",
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
