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
	User              string  `pg:"user,omitempty"`
	Channel           string  `pg:"channel,omitempty"`
	Title             string  `pg:"title,omitempty"`
	Artist            string  `pg:"artist,omitempty"`
	FormattedDuration string  `pg:"formatted_duration,omitempty"`
	DurationInSeconds float64 `pg:"duration_in_seconds,omitempty"`
	VideoID           string  `pg:"videoid,omitempty"`
	Position          int     `pg:"position,omitempty"`
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
func CreateSongTable(channel string, db *sql.DB) error {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS " + channel + " (id SERIAL, title VARCHAR NOT NULL, artist VARCHAR NOT NULL, userid VARCHAR NOT NULL, formatted_duration VARCHAR NOT NULL, duration_in_seconds INTEGER NOT NULL, videoid VARCHAR NOT NULL, PRIMARY KEY (videoid, title))")
	if err, ok := err.(*pq.Error); ok {
		return errors.New(err.Code.Name())
	}
	return nil
}

// Creates a setting table with the channel name and if everything goes well it return no error but if something does go wrong it will return an error
func CreateSongQueueSettingTable(channel string, db *sql.DB) error {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS " + channel + "_settings" + " (channel VARCHAR NOT NULL, status BOOLEAN NOT NULL, song_limit INTEGER NOT NULL, user_limit INTEGER NOT NULL, PRIMARY KEY (channel))")
	if err, ok := err.(*pq.Error); ok {
		return errors.New(err.Code.Name())
	}
	return nil
}

func InsertSong(db *sql.DB, song ClientSong, tableName string) error {
	// Converted Duration
	// ** bac-13-convert-time-accordingly **
	/**
		For some reason, the code below is preventing the song/video from being inserted into the db
		duration := fmt.Sprintf("%f", song.Duration / 100)
		log.Println(duration)
		durationFixed := strings.Replace(duration, ".", "m", 1)
		log.Println(durationFixed)
	**/
	_, err := db.Exec("INSERT INTO "+tableName+" VALUES ($1, $2, $3, $4, $5, $6, $7)", song.Position, song.Title, song.Artist, song.User, song.FormattedDuration, song.DurationInSeconds, song.VideoID)
	if err != nil {
		return err
	}
	if err, ok := err.(*pq.Error); ok {
		// 23505: unique_violation
		// 42P01: undefined_table
		if err.Code.Name() == "unique_violation" {
			return errors.New("that song is already in the queue")
		}
	}
	return nil
}

func UpdateSongQueueSettings(db *sql.DB, tableName string, status bool, song_limit float64, user_limit float64) error {

	_, err := db.Exec(`
		INSERT INTO `+tableName+`_settings (channel, status, song_limit, user_limit) 
		VALUES ($1, $2, $3, $4) 
		ON CONFLICT (channel) 
		DO UPDATE SET 
			status = EXCLUDED.status,
			song_limit = EXCLUDED.song_limit,
			user_limit = EXCLUDED.user_limit`,
		tableName, status, song_limit, user_limit)

	if err != nil {
		return err
	}

	return nil
}

// TODO: Catch errors when the iteration is over. i.e. when there are no entries just return 1 instead of those position
func GetLatestSongPosition(db *sql.DB, tableName string) (int, error) {
	res, err := db.Query("SELECT id FROM " + tableName + " ORDER BY id DESC LIMIT 1")
	if err, ok := err.(*pq.Error); ok {
		// 42P01: undefined_table
		if err.Code == "42P01" {
			return 0, errors.New(err.Code.Name())
		}
	}
	if res.Next() {
		var result int
		res.Scan(&result)
		return result, nil
	}
	defer res.Close()
	return 0, nil
}

func GetAllSongRequests(tableName string, db *sql.DB) (*[]models.SongQuery, *sql.DB, error) {
	res, err := db.Query("SELECT * FROM " + tableName + "")
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
		err := res.Scan(&song.Id, &song.Title, &song.Artist, &song.Userid, &song.FormattedDuration, &song.DurationInSeconds, &song.Videoid)
		if err != nil {
			log.Fatalf(err.Error())
		}
		songs = append(songs, song)
		sort.Slice(songs[:], func(i, j int) bool {
			return songs[i].Id < songs[j].Id
		})
	}
	defer res.Close()
	// db.Close()
	return &songs, db, nil
}

func GetSongQueueSettings(tableName string, db *sql.DB) (*[]models.SongQueueSettingsQueryResponse, *sql.DB, error) {
	res, err := db.Query("SELECT * FROM " + tableName + "")
	if err, ok := err.(*pq.Error); ok {
		if err != nil {
			return nil, nil, errors.New(err.Error())
		}
		if err.Code == "42P01" {
			settings := make([]models.SongQueueSettingsQueryResponse, 0)
			return &settings, nil, errors.New(err.Code.Name())
		}
	}
	settings := make([]models.SongQueueSettingsQueryResponse, 0)
	for res.Next() {
		setting := models.SongQueueSettingsQueryResponse{}
		err := res.Scan(&setting.Channel, &setting.Status, &setting.SongLimit, &setting.UserLimit)
		if err != nil {
			log.Fatalf(err.Error())
		}
		settings = append(settings, setting)
	}
	defer res.Close()
	// db.Close()
	return &settings, db, nil
}

func DeleteSong(tableName string, Id int, db *sql.DB) error {
	res, err := db.Exec("DELETE FROM "+tableName+" WHERE id = $1", Id)
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

func DeleteAllSongs(tableName string, db *sql.DB) error {
	_, err := db.Exec("DELETE FROM " + tableName + "")
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

func GetMultipleEntries(tableName string, user string, db *sql.DB) (bool, error) {
	res, err := db.Query("SELECT userid FROM "+tableName+" WHERE userid = $1", user)
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
func PromoteSong(tableName string, from int, to int, title string, db *sql.DB) error {

	// Querying through to check if the VideoID that is passed is actually in the index/position value the user passed to prevent errors.
	titleQuery, err := db.Query("SELECT title FROM "+tableName+" WHERE id = $1", from)
	if err, ok := err.(*pq.Error); ok {
		return err
	}

	var songTitle string

	for titleQuery.Next() {
		titleQuery.Scan(&songTitle)
	}

	if songTitle != title {
		return errors.New("the videoID you passed doesn't match the videoID in that position or with that id")
	}

	// Song/Video we are replacing for the "promoted"/updated Song/Video
	res2, err := db.Exec("UPDATE "+tableName+" SET id = $1 WHERE id = $2;", from, to)
	if err, ok := err.(*pq.Error); ok {
		log.Fatalln(err)

		return nil
	}
	_, err = res2.RowsAffected()
	if err != nil {
		log.Fatalln(err)
	}

	// Song/Video we are "promoting"/updating
	res, err := db.Exec("UPDATE "+tableName+" SET id = $1 WHERE id = $2 AND title = $3;", to, from, title)
	if err, ok := err.(*pq.Error); ok {
		log.Fatalln(err)
		return err
	}
	_, err = res.RowsAffected()
	if err != nil {
		log.Fatalln(err)
		return err
	}
	return nil
}
