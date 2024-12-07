package main

import (
	"crypto/tls"
	"fmt"
	"net"
	"twitch-bot/config"
	"twitch-bot/messages"
)

func main() {
	conn, err := connectToIRC(config.Server, config.Username, config.OAuth)
	if err != nil {
		fmt.Println("Error connecting to IRC:", err)
		return
	}
	defer conn.Close()

	// Join the specified channel
	joinChannel(conn, config.Channel)

	// Start reading messages
	messages.ReadMessages(conn)
}

func connectToIRC(server, username, oauth string) (net.Conn, error) {
	conn, err := tls.Dial("tcp", server, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to IRC server: %w", err)
	}

	// Send authentication messages
	fmt.Fprintf(conn, "PASS %s\r\n", oauth)
	fmt.Fprintf(conn, "NICK %s\r\n", username)

	return conn, nil
}

func joinChannel(conn net.Conn, channel string) {
	fmt.Fprintf(conn, "JOIN %s\r\n", channel)
}
