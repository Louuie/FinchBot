package twitch

import (
	"fmt"
	"net"
	"strings"
	"twitch-bot/config"
)

func JoinChannel(conn net.Conn, channel string) {
	fmt.Fprintf(conn, "JOIN %s\r\n", channel)
}

func HandleMessage(conn net.Conn, line string) {
	// If the IRC message is a chat message.
	parts := strings.Split(line, " ")
	msgIndex := 3
	if len(parts) > msgIndex {
		message := strings.Join(parts[msgIndex:], " ")[1:] // Skip the leading ':'
		fmt.Println("Message:", message)

		// Check if the twitch message starts with a "!" indicating a start of a command
		if strings.HasPrefix(message, "!") {
			HandleCommands(conn, message)
		}
	}
}

func SendMessage(conn net.Conn, message string) {
	fmt.Fprintf(conn, "PRIVMSG %s :%s\r\n", config.Channel, message)
	fmt.Println("Sent message:", message)
}
