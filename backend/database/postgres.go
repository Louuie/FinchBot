package database

import (
	"backend/twitch-bot/models"
	"database/sql"
	"errors"
	"log"
	"os"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

type DatabaseResult struct {
	DB      *sql.DB
	Channel string
}
type ClientSong struct {
	User     string  `json:"user,omitempty"`
	Channel  string  `json:"channel,omitempty"`
	Title    string  `json:"title,omitempty"`
	Artist   string  `json:"artist,omitempty"`
	Duration float64 `json:"duration,omitempty"`
	VideoID  string  `json:"videoid,omitempty"`
	Position int     `json:"position,omitempty"`
}

// Initializes the connection with the database and if everything went okay then it will return the db. if not it will return an error.
func InitializeConnection() (*sql.DB, error) {
	db, err := sql.Open("postgres", os.Getenv("POSTGRES_CONN"))
	if err, ok := err.(*pq.Error); ok {
		return nil, errors.New(err.Code.Name())
	}
	ping := db.Ping()
	if ping != nil {
		return nil, ping
	}
	return db, nil
}
// Creates a table with the channel name and if everything goes well it return no error but if something does go wrong it will return an error 
func CreateTable(channel string, db *sql.DB) error {
	res, err := db.Exec("CREATE TABLE IF NOT EXISTS " + channel + " (artist VARCHAR NOT NULL, duration INT NOT NULL, id SERIAL, title VARCHAR NOT NULL, userid VARCHAR NOT NULL, videoid VARCHAR NOT NULL, PRIMARY KEY (videoid, title))")
	if err, ok := err.(*pq.Error); ok {
		return errors.New(err.Code.Name())
	}
	log.Println(res)
	return nil
}

func InsertSong(db *sql.DB, song ClientSong, tableName string) error {
	res, err := db.Exec("INSERT INTO "+tableName+" VALUES ($1, $2, $3, $4, $5, $6)", song.Artist, song.Duration, song.Position, song.Title, song.User, song.VideoID)
	if err, ok := err.(*pq.Error); ok {
		// 23505: unique_violation
		// 42P01: undefined_table
		if err.Code.Name() == "unique_violation" {
			return errors.New("that song is already in the queue")
		}
	} 
	log.Println(res)
	return nil
}

//TODO: Catch errors when the iteration is over. i.e. when there are no entries just return 1 instead of those position
func GetLatestSongPosition(db *sql.DB, tableName string) (int, error) {
	log.Println(tableName)
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
		log.Println("result:", result)
		return result, nil
	}
	defer res.Close()
	return 0, nil
}

func GetAllSongRequests(tableName string, db *sql.DB) (*[]models.DatabaseQuery, error) {
	res, err := db.Query("SELECT * FROM " + tableName)
	if err, ok := err.(*pq.Error); ok {
		if err.Code == "42P01" {
			songs := make([]models.DatabaseQuery, 0)
			return &songs, errors.New(err.Code.Name())
		}
	}
	songs := make([]models.DatabaseQuery, 0)
	for res.Next() {
		song := models.DatabaseQuery{}
		err := res.Scan(&song.Artist, &song.Duration, &song.Id, &song.Title, &song.Userid, &song.Videoid)
		if err != nil {
			log.Fatalf(err.Error())
		}
		songs = append(songs, song)
	}
	defer res.Close()
	db.Close()
	return &songs, nil
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