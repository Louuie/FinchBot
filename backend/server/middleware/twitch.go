package middleware

import (
	"backend/twitch-bot/api"
	"backend/twitch-bot/handlers"
	"backend/twitch-bot/models"
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
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "missing code",
		})
	}

	twitchData, err := api.GetAccessToken(query.Code)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": err,
		})
	}
	if twitchData.Status != 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
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
	return c.Status(fiber.StatusAccepted).JSON(twitchData)
}

// Middleware function that checks if the user still has a valid access token
func TwitchAuthCheck(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	_ = handlers.CatchSessionError(sess, err)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error1": err.Error(),
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
	err = handlers.CatchSessionError(sess, err)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error2": err.Error(),
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
	err = handlers.CatchSessionError(sess, err)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error3": err.Error(),
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

func ModifyBroadcastInformation(c *fiber.Ctx) error {
	type Query struct {
		Title string `query:"title"`
		Game  string `query:"game"`
	}
	q := new(Query)
	if err := c.QueryParser(q); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": "couldn't parse the query",
		})
	}
	sess, err := store.Get(c)
	err = handlers.CatchSessionError(sess, err)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error4": err.Error(),
		})
	}
	userInfo, err := api.GetUserInfo(fmt.Sprintf("%v", sess.Get("access_token")))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": err.Error(),
		})
	}
	if q.Game == "" {
		categoryModel := models.ModifyChannel{
			GameID:     "",
			Title:      q.Title,
			StreamLang: "",
		}
		modifyStreamInformationErr := api.ModifyBroadcastInformation(fmt.Sprintf("%v", sess.Get("access_token")), userInfo.Data[0].ID, &categoryModel)
		if modifyStreamInformationErr != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"error": modifyStreamInformationErr.Error(),
			})
		}
		return c.Status(fiber.StatusAccepted).JSON(&fiber.Map{
			"success": "successfully set the title to " + categoryModel.Title,
		})
	}
	if q.Game == "unlisted" && q.Title == "" {
		categoryModel := models.ModifyChannel{
			GameID:     "unlisted",
			Title:      "",
			StreamLang: "",
		}
		log.Println(sess.Get("access_token"))
		modifyStreamInformationErr := api.ModifyBroadcastInformation(fmt.Sprintf("%v", sess.Get("access_token")), userInfo.Data[0].ID, &categoryModel)
		if modifyStreamInformationErr != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"error": modifyStreamInformationErr.Error(),
			})
		}
		return c.Status(fiber.StatusAccepted).JSON(&fiber.Map{
			"success": "successfully set the game to unlisted",
		})
	}
	gameData, err := api.SearchTwitchCategories(q.Game, fmt.Sprintf("%v", sess.Get("access_token")))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": err.Error(),
		})
	}
	if q.Game != "" && q.Title == "" {
		categoryModel := models.ModifyChannel{
			GameID:     gameData.Data[0].ID,
			Title:      "",
			StreamLang: "",
		}
		log.Println(sess.Get("access_token"))
		modifyStreamInformationErr := api.ModifyBroadcastInformation(fmt.Sprintf("%v", sess.Get("access_token")), userInfo.Data[0].ID, &categoryModel)
		if modifyStreamInformationErr != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
				"error": modifyStreamInformationErr.Error(),
			})
		}
		return c.Status(fiber.StatusAccepted).JSON(&fiber.Map{
			"success": "successfully set title to " + categoryModel.Title + " and set the game to " + gameData.Data[0].Name,
		})
	}
	categoryModel := models.ModifyChannel{
		GameID:     gameData.Data[0].ID,
		Title:      q.Title,
		StreamLang: "",
	}
	log.Println(sess.Get("access_token"))
	modifyStreamInformationErr := api.ModifyBroadcastInformation(fmt.Sprintf("%v", sess.Get("access_token")), userInfo.Data[0].ID, &categoryModel)
	if modifyStreamInformationErr != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"error": modifyStreamInformationErr.Error(),
		})
	}
	return c.Status(fiber.StatusAccepted).JSON(&fiber.Map{
		"success": "successfully set title to " + categoryModel.Title + " and set the game to " + gameData.Data[0].Name,
	})
}
