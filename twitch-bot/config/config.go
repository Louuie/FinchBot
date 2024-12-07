package config

import "os"

var (
	Server   = "irc.chat.twitch.tv:6697"
	Username = "fincchbot"
	OAuth    = os.Getenv("FINCHBOT_TWITCH_OAUTH") // Replace with your OAuth token
	Channel  = "#louiee_tv"                       // Replace with your channel name
)
