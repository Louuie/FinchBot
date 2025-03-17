package main

import (
	"backend/twitch-bot/server/middleware"
	"log"
)

func main() {
	app := middleware.Server()
	log.Fatal(app.Listen(":3030"))
}
