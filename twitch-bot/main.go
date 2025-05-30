package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"twitch-bot/config"
	"twitch-bot/irc"
	"twitch-bot/twitch"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	// Channel for passing messages from WS handler to IRC bot
	messages := make(chan string)

	// Start IRC bot in its own goroutine
	go func() {
		ircConn, err := irc.ConnectToIRC(config.Server, config.Username, config.OAuth) // Connect to Twitch IRC
		if err != nil {
			fmt.Println(err)
		}
		defer ircConn.Close()
		go irc.ReadMessages(ircConn)
		for msg := range messages {
			// Handles WS Messages (used for join/leave twitch-bot functionality)
			if strings.Contains(msg, "FINCHBOT_WS") {
				if strings.Contains(msg, "part") {
					// parse the channel from the leave msg
					msg := msg[17:]
					fmt.Println(msg)
					fmt.Printf("Attempting to leave the channel %s...", msg)
					twitch.PartChannel(ircConn, msg)
				}
				msg := msg[12:]
				fmt.Println(msg)
				// check for # otherwise its not gonna work
				if strings.Contains(msg, "#") {
					fmt.Printf("Channel reccieved: %s\n", msg)
					fmt.Printf("Attempting to join the new channel %s...", msg)
					twitch.JoinChannel(ircConn, msg)
				}
			}
		}
	}()

	// Start WebSocket server
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("Upgrade error:", err)
			return
		}
		defer ws.Close()

		for {
			_, msg, err := ws.ReadMessage()
			if err != nil {
				log.Println("Read error:", err)
				break
			}
			// Pass received WS message to IRC bot
			messages <- string(msg)
		}
	})

	// Listen on port
	port := os.Getenv("PORT")
	log.Println("WebSocket server started on :" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
