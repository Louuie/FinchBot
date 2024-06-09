package main

import (
	"backend/twitch-bot/server/middleware"
	"fmt"
	"log"
	"strings"
)

func main() {
	var port string
	fmt.Print("Enter the port you would like to run the server on (eg: 3030, 4040, 5050): ")
	fmt.Scan(&port)
	port = strings.Replace(port, ":", "", 1)
	app := middleware.Server()
	log.Fatal(app.Listen(":" + port))
}
