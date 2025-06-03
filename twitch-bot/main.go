package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"
	"twitch-bot/config"
	"twitch-bot/irc"
	"twitch-bot/twitch"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	// Add timeouts to prevent hanging connections
	HandshakeTimeout: 45 * time.Second,
	ReadBufferSize:   1024,
	WriteBufferSize:  1024,
}

func main() {
	// Channel for passing messages from WS handler to IRC bot
	messages := make(chan string, 100) // Buffered channel to prevent blocking

	// Start IRC bot in its own goroutine
	go func() {
		ircConn, err := irc.ConnectToIRC(config.Server, config.Username, config.OAuth)
		if err != nil {
			log.Printf("IRC connection error: %v", err)
			return
		}
		defer ircConn.Close()

		go irc.ReadMessages(ircConn)

		for msg := range messages {
			handleIRCMessage(ircConn, msg)
		}
	}()

	// Start WebSocket server
	http.HandleFunc("/ws", handleWebSocket(messages))

	// Listen on port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not set
	}

	log.Printf("WebSocket server started on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleIRCMessage(ircConn net.Conn, msg string) {
	// Handles WS Messages (used for join/leave twitch-bot functionality)
	if strings.Contains(msg, "FINCHBOT_WS") {
		if strings.Contains(msg, "part") {
			// Parse the channel from the leave msg
			channel := strings.TrimSpace(msg[17:])
			log.Printf("Attempting to leave channel: %s", channel)
			twitch.PartChannel(ircConn, channel)
			return
		}

		// Handle join command
		channel := strings.TrimSpace(msg[12:])
		log.Printf("Processing join command for: %s", channel)

		// Check for # prefix, add if missing
		if !strings.HasPrefix(channel, "#") {
			channel = "#" + channel
		}

		log.Printf("Attempting to join channel: %s", channel)
		twitch.JoinChannel(ircConn, channel)
	}
}

func handleWebSocket(messages chan<- string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("WebSocket upgrade error: %v", err)
			return
		}
		defer ws.Close()

		// Set read/write deadlines to prevent hanging connections
		ws.SetReadDeadline(time.Now().Add(60 * time.Second))
		ws.SetWriteDeadline(time.Now().Add(10 * time.Second))

		// Set up ping/pong handlers to detect disconnections
		ws.SetPongHandler(func(string) error {
			ws.SetReadDeadline(time.Now().Add(60 * time.Second))
			return nil
		})

		// Start a goroutine to send periodic pings
		go func() {
			ticker := time.NewTicker(30 * time.Second)
			defer ticker.Stop()

			for {
				select {
				case <-ticker.C:
					ws.SetWriteDeadline(time.Now().Add(10 * time.Second))
					if err := ws.WriteMessage(websocket.PingMessage, nil); err != nil {
						log.Printf("Ping error: %v", err)
						return
					}
				}
			}
		}()

		for {
			// Reset read deadline for each message
			ws.SetReadDeadline(time.Now().Add(60 * time.Second))

			_, msg, err := ws.ReadMessage()
			if err != nil {
				// Check if it's a normal closure or unexpected error
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("WebSocket unexpected close error: %v", err)
				} else {
					log.Printf("WebSocket connection closed: %v", err)
				}
				break
			}

			messageText := strings.TrimSpace(string(msg))
			log.Printf("Received WS message: %s", messageText)

			// Validate message before processing
			if messageText == "" {
				continue
			}

			// Send acknowledgment with error handling
			ws.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := ws.WriteMessage(websocket.TextMessage, []byte("Received: "+messageText)); err != nil {
				log.Printf("Write acknowledgment error: %v", err)
				break
			}

			// Forward to IRC bot (non-blocking)
			select {
			case messages <- messageText:
				// Message sent successfully
			default:
				log.Printf("Warning: Message queue full, dropping message: %s", messageText)
			}

			// Send confirmation with error handling
			ws.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := ws.WriteMessage(websocket.TextMessage, []byte("Processing: "+messageText)); err != nil {
				log.Printf("Write confirmation error: %v", err)
				break
			}
		}

		log.Println("WebSocket connection handler finished")
	}
}
