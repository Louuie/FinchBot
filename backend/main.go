package main

import (
	"backend/twitch-bot/server/middleware"
	"log"
	"os"
)

func main() {
	app := middleware.Server()
	port := os.Getenv("PORT")
	log.Fatal(app.Listen("0.0.0.0:" + port))
}
