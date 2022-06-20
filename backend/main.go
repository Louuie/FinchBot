package main

import (
	"backend/twitch-bot/middleware"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(), logger.New())
	app.Get("/youtube", middleware.SongRequest)
	app.Get("/delete", middleware.DeleteSong)
	app.Get("/songs", middleware.FetchAllSongs)
	app.Post("/auth/twitch", middleware.TwitchAuth)
	log.Fatal(app.Listen(":3030"))
}
