package main

import (
	"bufio"
	"crypto/tls"
	"fmt"
	"net"
	"strings"
	"time"
)

func main() {
	conn, err := IRCConnection()
	if err != nil {
		fmt.Println("Error connecting to IRC:", err)
		return
	}
	defer IRCDisconnect(conn)

	// Start a goroutine to handle incoming messages
	go readIRCMessages(conn)

	// Prevent the main function from exiting immediately
	select {}
}

func IRCConnection() (net.Conn, error) {
	// Use tls.Dial to establish an SSL connection if using port 6697
	c, err := tls.Dial("tcp", "irc.chat.twitch.tv:6697", nil)
	if err != nil {
		return nil, err
	}
	writer := bufio.NewWriter(c)
	sendIRCMessage(writer, "CAP REQ :twitch.tv/tags twitch.tv/commands")
	sendIRCMessage(writer, "PASS oauth:y8t41t1ykcesny5t5zlhxmhxl2rh3c")
	sendIRCMessage(writer, "NICK Louiee_tv")

	// Sending a message
	sendIRCMessage(writer, "PRIVMSG #Louiee_tv :Hello World!")
	// Joining an actual channel
	sendIRCMessage(writer, "JOIN #Louiee_tv")

	return c, nil
}

func IRCDisconnect(IRCConn net.Conn) {
	IRCConn.Close()
	fmt.Println("Disconnected from IRC")
}

func sendIRCMessage(writer *bufio.Writer, command string) {
	fmt.Fprintf(writer, "%s\r\n", command)
	writer.Flush()
	// Small delay to avoid flooding the server
	time.Sleep(100 * time.Millisecond)
}

func readIRCMessages(conn net.Conn) {
	reader := bufio.NewReader(conn)
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println("Error reading from IRC:", err)
			return
		}

		line = strings.TrimSpace(line)
		if len(line) > 0 {
			fmt.Println("Received:", line)
			handleIRCMessage(line, conn)
		}
	}
}

func handleIRCMessage(message string, conn net.Conn) {
	// Handle different types of messages here
	if strings.HasPrefix(message, ":tmi.twitch.tv 001") {
		// Handle welcome message indicating successful authentication
		fmt.Println("Successfully authenticated:", message)
	} else if strings.HasPrefix(message, ":tmi.twitch.tv 002") ||
		strings.HasPrefix(message, ":tmi.twitch.tv 003") ||
		strings.HasPrefix(message, ":tmi.twitch.tv 004") ||
		strings.HasPrefix(message, ":tmi.twitch.tv 375") ||
		strings.HasPrefix(message, ":tmi.twitch.tv 372") ||
		strings.HasPrefix(message, ":tmi.twitch.tv 376") ||
		strings.HasPrefix(message, "@badge-info=") {
		// Handle additional welcome messages
		fmt.Println("Welcome message:", message)
	} else if strings.HasPrefix(message, "Hello World") {
		fmt.Println("My Command I sent: ", message)
	} else {
		// Handle other IRC messages
		fmt.Println("IRC Message:", message)
	}
}
