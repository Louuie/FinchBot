package twitch

import (
	"fmt"
	"net"
	"strings"
	"twitch-bot/api"
)

func HandleCommands(conn net.Conn, message string) {
	if strings.Contains(message, "addsong") {
		addSongContent := strings.Replace(message, "!addsong ", "", 1)
		addSongResponse, err := api.AddSong(addSongContent)
		if err != nil {
			SendMessage(conn, err.Error())
			return
		}
		SendMessage(conn, fmt.Sprintf("Successfully added %s by %s to the song queue in position #%d",
			addSongResponse.Data[0].Name, addSongResponse.Data[0].Artist, addSongResponse.Data[0].Position))
	}
}
