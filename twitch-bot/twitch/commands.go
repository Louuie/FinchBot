package twitch

import (
	"fmt"
	"net"
	"strings"
	"twitch-bot/api"
)

func HandleCommands(conn net.Conn, message string, channel string, username string) {
	if strings.Contains(message, "addsong") {
		addSongContent := strings.Replace(message, "!addsong ", "", 1)
		addSongResponse, err := api.AddSong(addSongContent, channel, username)
		if err != nil {
			SendMessage(conn, err.Error(), channel)
			return
		}
		SendMessage(conn, fmt.Sprintf("Successfully added %s by %s to the song queue",
			addSongResponse.Data[0].Name, addSongResponse.Data[0].Artist), channel)
	}
}
