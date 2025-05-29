package main

import (
	"backend/twitch-bot/server/middleware"
	"log"
)

func main() {
	app := middleware.Server()
	port := "3030"
	log.Fatal(app.Listen("0.0.0.0:" + port))
}
