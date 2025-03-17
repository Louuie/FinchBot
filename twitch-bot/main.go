package main

import (
	"fmt"
	"twitch-bot/config"
	"twitch-bot/irc"
	"twitch-bot/twitch"
)

func main() {
	conn, err := irc.ConnectToIRC(config.Server, config.Username, config.OAuth)
	if err != nil {
		fmt.Println("Error connecting to IRC:", err)
		return
	}
	defer conn.Close()

	twitch.JoinChannel(conn, config.Channel)
	irc.ReadMessages(conn)
}
