// TODO: Need to fix injection vunerabilities immedatately
package database

import (
	"backend/twitch-bot/models"
	"database/sql"
	"errors"
	"log"
	"os"
	"sort"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

type DatabaseResult struct {
	DB      *sql.DB
	Channel string
}
type ClientSong struct {
	Id                string  `pg:"id,omitempty"`
	User              string  `pg:"user,omitempty"`
	Channel           string  `pg:"channel,omitempty"`
	Title             string  `pg:"title,omitempty"`
	Artist            string  `pg:"artist,omitempty"`
	FormattedDuration string  `pg:"formatted_duration,omitempty"`
	DurationInSeconds float64 `pg:"duration_in_seconds,omitempty"`
	VideoID           string  `pg:"videoid,omitempty"`
}

// Initializes the connection with the song database and if everything went okay then it will return the db. if not it will return an error.
func InitializeSongDBConnection() (*sql.DB, error) {
	db, err := sql.Open("postgres", os.Getenv("SONGS_DB_CONN"))
	if err, ok := err.(*pq.Error); ok {
		return nil, errors.New(err.Code.Name())
	}
	ping := db.Ping()
	if ping != nil {
		return nil, ping
	}
	return db, nil
}

// Initializes the connection with the settings database and if everything went okay then it will return the db. if not it will return an error.
func InitializeSettingsDBConnection() (*sql.DB, error) {
	db, err := sql.Open("postgres", os.Getenv("SETTINGS_DB_CONN"))
	if err, ok := err.(*pq.Error); ok {
		return nil, errors.New(err.Code.Name())
	}
	ping := db.Ping()
	if ping != nil {
		return nil, ping
	}
	return db, nil
}

// Creates a song table with the channel name and if everything goes well it return no error but if something does go wrong it will return an error
func CreateSongTable(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS songs (
			id BIGSERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			artist TEXT,
			user_id TEXT NOT NULL,
			channel TEXT NOT NULL,
			formatted_duration TEXT,
			duration_in_seconds INTEGER,
			video_id TEXT NOT NULL,
			position INTEGER NOT NULL,
			UNIQUE (video_id, channel)
		)
	`)
	if err, ok := err.(*pq.Error); ok {
		return errors.New(err.Code.Name())
	}
	return nil
}

// // Creates a setting table with the channel name and if everything goes well it return no error but if something does go wrong it will return an error
// func CreateSongQueueSettingTable(channel string, db *sql.DB) error {
// 	_, err := db.Exec("CREATE TABLE IF NOT EXISTS " + channel + "_settings" + " (channel VARCHAR NOT NULL, status BOOLEAN NOT NULL, song_limit INTEGER NOT NULL, user_limit INTEGER NOT NULL, PRIMARY KEY (channel))")
// 	if err, ok := err.(*pq.Error); ok {
// 		return errors.New(err.Code.Name())
// 	}
// 	return nil
// }

func InsertSong(db *sql.DB, song ClientSong, tableName string) error {
	var newPosition int
	err := db.QueryRow(`
		SELECT COALESCE(MAX(position), 0) + 1 FROM songs WHERE LOWER(channel) = LOWER($1)
	`, song.Channel).Scan(&newPosition)

	if err != nil {
		return err
	}

	_, err = db.Exec(`
		INSERT INTO songs (title, artist, user_id, channel, formatted_duration, duration_in_seconds, video_id, position)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`, song.Title, song.Artist, song.User, song.Channel, song.FormattedDuration, song.DurationInSeconds, song.VideoID, newPosition)
	if err, ok := err.(*pq.Error); ok {
		// 23505: unique_violation
		// 42P01: undefined_table
		if err.Code.Name() == "unique_violation" {
			return errors.New("that song is already in the queue")
		}
	}
	return nil
}

func InsertTwitchChannel(channel string, db *sql.DB) error {
	// First create the table, before inserting the twitch-channel
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS twitchbot (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, channel VARCHAR(255) NOT NULL)")
	if err != nil {
		return err
	}
	// Now try inserting the channel into the new table
	_, insert_err := db.Exec("INSERT INTO twitchbot (channel) VALUES ($1)", channel)
	if insert_err != nil {
		if err, ok := err.(*pq.Error); ok {
			// 23505: unique_violation
			// 42P01: undefined_table
			if err.Code.Name() == "unique_violation" {
				return errors.New("the bot is already joined into that channel")
			}
		}
		return insert_err
	}
	return nil
}

// func UpdateSongQueueSettings(db *sql.DB, tableName string, status bool, song_limit float64, user_limit float64) error {

// 	_, err := db.Exec(`
// 		INSERT INTO `+tableName+`_settings (channel, status, song_limit, user_limit)
// 		VALUES ($1, $2, $3, $4)
// 		ON CONFLICT (channel)
// 		DO UPDATE SET
// 			status = EXCLUDED.status,
// 			song_limit = EXCLUDED.song_limit,
// 			user_limit = EXCLUDED.user_limit`,
// 		tableName, status, song_limit, user_limit)

// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

func GetAllSongRequests(channel string, db *sql.DB) (*[]models.SongQuery, *sql.DB, error) {
	res, err := db.Query("SELECT * FROM songs WHERE LOWER(channel) = LOWER($1)", channel)
	if err, ok := err.(*pq.Error); ok {
		if err != nil {
			return nil, nil, errors.New(err.Error())
		}
		if err.Code == "42P01" {
			songs := make([]models.SongQuery, 0)
			return &songs, nil, errors.New(err.Code.Name())
		}
	}
	songs := make([]models.SongQuery, 0)
	for res.Next() {
		song := models.SongQuery{}
		err := res.Scan(&song.Id, &song.Title, &song.Artist, &song.Userid, &song.Channel, &song.FormattedDuration, &song.DurationInSeconds, &song.Videoid, &song.Position)
		if err != nil {
			return nil, nil, err
		}
		songs = append(songs, song)
		sort.Slice(songs[:], func(i, j int) bool {
			return songs[i].Position < songs[j].Position
		})
	}
	defer res.Close()
	// db.Close()
	return &songs, db, nil
}

// TODO: Fix SongQueueSettings, whether that be fixing the SQL Injections as well as getting the docker container online for it

// func GetSongQueueSettings(tableName string, db *sql.DB) (*[]models.SongQueueSettingsQueryResponse, *sql.DB, error) {
// 	res, err := db.Query("SELECT * FROM " + tableName + "")
// 	if err, ok := err.(*pq.Error); ok {
// 		if err != nil {
// 			return nil, nil, errors.New(err.Error())
// 		}
// 		if err.Code == "42P01" {
// 			settings := make([]models.SongQueueSettingsQueryResponse, 0)
// 			return &settings, nil, errors.New(err.Code.Name())
// 		}
// 	}
// 	settings := make([]models.SongQueueSettingsQueryResponse, 0)
// 	for res.Next() {
// 		setting := models.SongQueueSettingsQueryResponse{}
// 		err := res.Scan(&setting.Channel, &setting.Status, &setting.SongLimit, &setting.UserLimit)
// 		if err != nil {
// 			log.Fatalf(err.Error())
// 		}
// 		settings = append(settings, setting)
// 	}
// 	defer res.Close()
// 	// db.Close()
// 	return &settings, db, nil
// }

func GetTwitchChannels(db *sql.DB) (*[]models.BotData, error) {
	res, err := db.Query("SELECT channel FROM twitchbot")
	if err != nil {
		// Check for pq-specific error
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == "42P01" { // undefined_table
				botClientData := make([]models.BotData, 0)
				return &botClientData, errors.New("table does not exist: " + pqErr.Code.Name())
			}
			return nil, errors.New(pqErr.Error())
		}
		return nil, err
	}
	defer res.Close()

	twitchBotClientData := make([]models.BotData, 0)
	for res.Next() {
		var channel string
		if err := res.Scan(&channel); err != nil {
			return nil, err
		}
		twitchBotClientData = append(twitchBotClientData, models.BotData{
			Channel: channel,
		})
	}

	return &twitchBotClientData, nil
}

func DeleteSong(channel string, Id int, db *sql.DB) error {
	res, err := db.Exec("DELETE FROM songs WHERE LOWER(channel) = LOWER($1) AND id = $2", channel, Id)
	if err, ok := err.(*pq.Error); ok {
		return errors.New(err.Code.Name())
	}
	numofRows, err := res.RowsAffected()
	if err != nil {
		log.Fatalln(err)
	}
	if numofRows == 0 {
		return errors.New("couldn't find a song with that id")
	}
	db.Close()
	return nil
}

func DeleteAllSongs(channel string, db *sql.DB) error {
	_, err := db.Exec("DELETE FROM songs WHERE LOWER(channel) = LOWER($1)", channel)
	if err, ok := err.(*pq.Error); ok {
		return errors.New(err.Code.Name())
	}
	if err, ok := err.(*pq.Error); ok {
		if err != nil {
			return err
		}
	}
	return nil
}

func GetMultipleEntries(channel string, user string, db *sql.DB) (bool, error) {
	res, err := db.Query("SELECT user_id FROM songs WHERE LOWER(channel) = LOWER($1) AND user_id = $2", channel, user)
	if err, ok := err.(*pq.Error); ok {
		log.Fatalln(err)
		return false, errors.New(err.Code.Name())
	}
	count := 0
	for res.Next() {
		count++
	}
	if count == 2 {
		return true, nil
	}
	defer res.Close()
	return false, nil
}

// Function that promotes the song in the queue. For more information about what "Promoting the song" does, please refer to issue bac-14 in linear.
func PromoteSong(channel string, fromPosition int, db *sql.DB) (string, error) {
	// Find the song at that position
	var songID int
	var songTitle string
	err := db.QueryRow(`
		SELECT id, title FROM songs
		WHERE LOWER(channel) = LOWER($1) AND position = $2
	`, channel, fromPosition).Scan(&songID, &songTitle)
	if err != nil {
		return "", errors.New("no song found in that position")
	}

	// Move everything between [1, fromPosition - 1] down by 1
	_, err = db.Exec(`
		UPDATE songs SET position = position + 1
		WHERE LOWER(channel) = LOWER($1) AND position < $2
	`, channel, fromPosition)
	if err != nil {
		return "", err
	}

	// Promote the selected song to position 1
	_, err = db.Exec(`
		UPDATE songs SET position = 1 WHERE id = $1
	`, songID)
	if err != nil {
		return "", err
	}

	return songTitle, nil
}
