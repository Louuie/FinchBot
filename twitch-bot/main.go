package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"
	"twitch-bot/config"
	"twitch-bot/irc"
	"twitch-bot/twitch"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer
	pongWait = 60 * time.Second

	// Send pings to peer with this period (must be less than pongWait)
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
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

		log.Println("New WebSocket connection established")

		// Configure connection settings
		ws.SetReadLimit(maxMessageSize)
		ws.SetReadDeadline(time.Now().Add(pongWait))
		ws.SetPongHandler(func(string) error {
			ws.SetReadDeadline(time.Now().Add(pongWait))
			return nil
		})

		// Channel to signal when to stop the ping ticker
		done := make(chan struct{})

		// Start ping ticker in a goroutine
		go func() {
			ticker := time.NewTicker(pingPeriod)
			defer ticker.Stop()

			for {
				select {
				case <-ticker.C:
					ws.SetWriteDeadline(time.Now().Add(writeWait))
					if err := ws.WriteMessage(websocket.PingMessage, nil); err != nil {
						log.Println("Ping error:", err)
						return
					}
				case <-done:
					return
				}
			}
		}()

		// Read messages from client
		for {
			_, msg, err := ws.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("WebSocket unexpected close error: %v", err)
				} else {
					log.Println("WebSocket connection closed")
				}
				close(done)
				break
			}

			// Reset read deadline on successful message
			ws.SetReadDeadline(time.Now().Add(pongWait))

			// Pass received WS message to IRC bot
			messages <- string(msg)
		}
	})

	// Listen on port
	log.Println("WebSocket server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
