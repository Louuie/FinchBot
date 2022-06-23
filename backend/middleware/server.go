package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var (
	store *session.Store
)

func Server() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "*",
		AllowHeaders:     "Access-Control-Allow-Origin, Content-Type, Origin, Accept",
	}), logger.New())
	store = session.New(session.Config{
		CookieHTTPOnly: true,
		Expiration:     time.Hour * 5,
	})
	app.Get("/song-request", SongRequest)
	app.Get("/song-request-delete", DeleteSong)
	app.Get("/songs", FetchAllSongs)
	app.Post("/auth/twitch", TwitchAuth)
	app.Get("/auth/twitch/validate", TwitchAuthCheck)
	app.Get("/auth/twitch/user", TwitchUserInfo)
	app.Post("/auth/twitch/revoke", TwitchAuthRevoke)
	log.Fatal(app.Listen(":3030"))
}