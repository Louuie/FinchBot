package middleware

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var (
	store *session.Store
)

func Server() *fiber.App {

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:4173, https://finchbot.xyz",
		AllowHeaders:     "Access-Control-Allow-Origin, Content-Type, Origin, Accept, Authorization",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}), logger.New())

	isDev := os.Getenv("ENV") == "dev" // or however you define your dev environment

	store = session.New(session.Config{
		CookieHTTPOnly: true,
		CookieSecure:   !isDev, // false in dev, true in prod
		CookieSameSite: func() string {
			if isDev {
				return "Lax" // Works on localhost
			}
			return "None" // Required for cross-domain cookies on HTTPS
		}(),
		CookieDomain: func() string {
			if isDev {
				return "" // Leave blank for localhost
			}
			return "finchbot.xyz"
		}(),
		CookiePath: "/",
		Expiration: time.Hour * 5,
	})

	//app.Use(limiter.New())
	// Route used to enter a song/video into the queue
	app.Get("/song-request", SongRequest)

	// Route used to delete a song from the queue. (REQUEST: possibly delete this route and implement the delete feature into the song request router?
	// for example the user passes delete as a query parameter to differenate whether they are enetering a song/video or deleting one)
	app.Get("/song-request-delete", DeleteSong)

	// Route that fetches all the active songs/videos currentely in the queue
	app.Get("/songs", FetchAllSongs)

	// Route that authenticates the user to Twitch and stores that login information into a session on the server.
	app.Post("/auth/twitch", TwitchAuth)

	// Route that fetches the users twitch information. (MUST BE AUTHED)
	app.Get("/twitch/user", TwitchUserInfo)

	// Route that allows you to modify the users twitch broadcaster information, such as the title and the game. (MUST BE AUTHED)
	app.Post("/twitch/modify", ModifyBroadcastInformation)

	// Route that validates that the user still has a valid twitch access token. (MUST BE AUTHED)
	app.Post("/auth/twitch/validate", TwitchAuthCheck)

	// Route that allows the user the user to revoke the current access_token that is being used on that active session.
	app.Post("/auth/twitch/revoke", TwitchAuthRevoke)

	// Route that allows the a Moderator or the Streamer to move the Song/Video up in the queue on the website.
	app.Post("/promote-song", PromoteSong)

	// Route that allows a Moderator or the Streamer to delete/clear all the songs in the queue.
	app.Post("/delete-all-songs", DeleteAllSongs)

	// Route that fetches the Song Queue setting.
	// app.Get("/song-queue-settings", GetSongQueueSettings)

	// Route that sets the Song Queue setting.
	// app.Post("/song-queue-settings", SetSongQueueSettings)

	// Route that joins the twitch-bot into the users twitch channel
	app.Post("join-channel", JoinChannel)

	// Route that parts the twitch-bot from the users twitch channel
	app.Post("part-channel", PartChannel)

	// Route that gets all the twitch channels that the bot is joined in
	app.Get("/fetch-channels", GetAllJoinedTwitchChannels)

	return app
}
