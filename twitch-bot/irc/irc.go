package irc

import (
	"bufio"
	"crypto/tls"
	"fmt"
	"net"
	"strings"
	"twitch-bot/twitch"
)

func ReadMessages(conn net.Conn) {
	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		line := scanner.Text()
		fmt.Println("Received:", line)
		HandleMessage(conn, line)
	}
}

func HandleMessage(conn net.Conn, line string) {
	if strings.Contains(line, "PRIVMSG") {
		parts := strings.Split(line, " ")
		if len(parts) > 2 {
			channel := parts[2] // correctly extract channel from IRC message
			twitch.HandleMessage(conn, line, channel)
		}
	}

	// Respond to twitch PING messages to keep the connection alive
	if strings.HasPrefix(line, "PING") {
		conn.Write([]byte("PONG :tmi.twitch.tv\r\n"))
		fmt.Println("Sent: PONG to tmi.twitch.tv")
	}
}

func ConnectToIRC(server, username, oauth string) (net.Conn, error) {
	conn, err := tls.Dial("tcp", server, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to IRC server: %w", err)
	}

	// Send authentication messages
	fmt.Fprintf(conn, "PASS %s\r\n", oauth)
	fmt.Fprintf(conn, "NICK %s\r\n", username)
	return conn, nil
}
