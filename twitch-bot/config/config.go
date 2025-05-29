package config

import "os"

var (
	Server   = "irc.chat.twitch.tv:6697"
	Username = "fincchbot"
	OAuth    = os.Getenv("FINCHBOT_TWITCH_OAUTH")
)
