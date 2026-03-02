package twitch

import (
	"fmt"
	"net"
	"strings"
)

func JoinChannel(conn net.Conn, channel string) {
	fmt.Fprintf(conn, "JOIN %s\r\n", channel)
}

func PartChannel(conn net.Conn, channel string) {
	fmt.Fprintf(conn, "PART %s\r\n", channel)
}

func HandleMessage(conn net.Conn, line string, channel string) {
	// Extract username from the line (before the first '!')
	username := ""
	if strings.HasPrefix(line, ":") {
		userPart := strings.Split(line, "!")[0][1:] // Remove ':' and get part before '!'
		username = userPart
	}

	// If the IRC message is a chat message.
	parts := strings.Split(line, " ")
	msgIndex := 3
	if len(parts) > msgIndex {
		message := strings.Join(parts[msgIndex:], " ")[1:] // Skip the leading ':'
		fmt.Printf("Message from %s: %s\n", username, message)

		// Check if the twitch message starts with a "!" indicating a start of a command
		if strings.HasPrefix(message, "!") {
			HandleCommands(conn, message, channel, username) // Pass username to HandleCommands
		}
	}
}

func SendMessage(conn net.Conn, message string, channel string) {
	fmt.Fprintf(conn, "PRIVMSG %s :%s\r\n", channel, message)
	fmt.Println("Sent message:", message)
}
