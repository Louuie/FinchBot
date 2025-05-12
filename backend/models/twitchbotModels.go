package models

type BotData struct {
	Channel string `json:"channel,omitempty"`
}
type TwitchBotClientData struct {
	Status  string    `json:"status,omitempty"`
	Message string    `json:"message,omitempty"`
	Data    []BotData `json:"data,omitempty"`
}
