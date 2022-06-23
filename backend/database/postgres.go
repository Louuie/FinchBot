package database

import (
	"backend/twitch-bot/models"
	"database/sql"
	"errors"
	"log"
	"os"
	"strings"

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

func InitializeConnection() *sql.DB {
	dbChan := make(chan *sql.DB)
	go func() {
		db, err := sql.Open("postgres", os.Getenv("POSTGRES_CONN"))
		if err != nil {
			log.Fatalln(err)
		}
		ping := db.Ping()
		if ping != nil {
			log.Fatalln(ping)
		}
		db.SetMaxOpenConns(4)
		dbChan <- db
	}()
	return <-dbChan
}

func CreateTable(channel string, db *sql.DB) {
	go func() {
		res, err := db.Exec("CREATE TABLE IF NOT EXISTS " + channel + " (artist VARCHAR NOT NULL, duration INT NOT NULL, id SERIAL, title VARCHAR NOT NULL, userid VARCHAR NOT NULL, videoid VARCHAR NOT NULL, PRIMARY KEY (videoid, title))")
		if err != nil {
			log.Fatalln(err)
		}
		log.Println(res)
	}()
}

func InsertSong(db *sql.DB, song ClientSong, tableName string) string {
	insertDataChan := make(chan string)
	go func() {
		res, err := db.Exec("INSERT INTO "+tableName+" VALUES ($1, $2, $3, $4, $5, $6)", song.Artist, song.Duration, song.Position, song.Title, song.User, song.VideoID)
		if err != nil {
			if strings.Contains(err.Error(), "duplicate key") {
				insertDataChan <- "That song is already in the queue"
			}
		} else {
			insertDataChan <- ""
		}
		log.Println(res)
	}()
	return <-insertDataChan
}

//TODO: Catch errors when the iteration is over. i.e. when there are no entries just return 1 instead of those position
func GetLatestSongPosition(db *sql.DB, tableName string) int {
	res, err := db.Query("SELECT id FROM " + tableName + " ORDER BY id DESC LIMIT 1")
	if err != nil {
		if strings.Contains(err.Error(), "relation") {
			return 0
		}
	}
	if res.Next() {
		var result int
		res.Scan(&result)
		log.Println("result:", result)
		return result
	}
	defer res.Close()
	return 0
}

func GetAllSongRequests(tableName string, db *sql.DB) (*[]models.DatabaseQuery, error) {
	res, err := db.Query("SELECT * FROM " + tableName)
	if err != nil {
		if strings.Contains(err.Error(), "relation") {
			songs := make([]models.DatabaseQuery, 0)
			return &songs, errors.New("table does not exist")
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
	if err != nil {
		return err
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