package messages

import (
	"bufio"
	"fmt"
	"log"
	"net"
	"strings"
	"twitch-bot/api"
	"twitch-bot/config"
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
		msgIndex := 3
		if len(parts) > msgIndex {
			message := strings.Join(parts[msgIndex:], " ")[1:] // Skip the leading ':'
			fmt.Println("Message:", message)

			if strings.HasPrefix(message, "!help") {
				SendMessage(conn, "This is the help message you requested.")
			}

			if strings.HasPrefix(message, "!add") {
				addSongContent := strings.Replace(message, "!addsong", "", 1)
				addSongResponse, err := api.AddSong(addSongContent)
				if err != nil {
					SendMessage(conn, err.Error())
				}
				SendMessage(conn, "Successfully added "+addSongResponse.Data[0].Name+" by "+addSongResponse.Data[0].Artist+" to the song queue in position #"+fmt.Sprintf("%v", addSongResponse.Data[0].Position))
			}

			if strings.HasPrefix(message, "!promote") {
				promoteSongContent := strings.Replace(message, "!promote", "", 1)
				promoteSongContentwords := strings.Fields(promoteSongContent)
				promoteSongResponse, err := api.PromoteSong(promoteSongContentwords[0])
				if err != nil && promoteSongResponse == nil {
					SendMessage(conn, "Error "+err.Error()+"")
					log.Fatalln(err)
				}
				SendMessage(conn, promoteSongResponse.Message)
			}

			// TODO: Add command for handling the streamers channel
		}
	}
}

func SendMessage(conn net.Conn, message string) {
	fmt.Fprintf(conn, "PRIVMSG %s :%s\r\n", config.Channel, message)
	fmt.Println("Sent message:", message)
}
