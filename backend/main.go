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
	app.Use(cors.New())
	app.Use(logger.New())
	app.Get("/youtube", middleware.SongRequest)
	log.Fatal(app.Listen(":3000"))
}
