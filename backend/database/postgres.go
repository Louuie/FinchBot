package database

import (
	"database/sql"
	"log"
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

func initializeConnection() *sql.DB {
	dbChan := make(chan *sql.DB)
	go func() {
		connStr := "postgresql://song_request_admin:MEMO387ad22509@107.185.51.97:5432/song-entries?sslmode=disable"
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatalln(err)
		}
		ping := db.Ping()
		if ping != nil {
			log.Fatalln(ping)
		}
		dbChan <- db
	}()
	return <-dbChan
}

func CreateTable(channel string) DatabaseResult {
	testChan := make(chan DatabaseResult)
	go func() {
		db := initializeConnection()
		res, err := db.Exec("CREATE TABLE IF NOT EXISTS " + channel + " (artist VARCHAR NOT NULL, duration INT NOT NULL, id SERIAL, title VARCHAR NOT NULL, userid VARCHAR NOT NULL, videoid VARCHAR NOT NULL, PRIMARY KEY (videoid, title))")
		if err != nil {
			log.Fatalln(err)
		}
		log.Println(res)
		dbRes := DatabaseResult{
			DB:      db,
			Channel: channel,
		}
		testChan <- dbRes
	}()
	return <-testChan
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
	latestSongPosChan := make(chan int)
	go func() {
		res, err := db.Query("SELECT id FROM " + tableName + " ORDER BY id DESC LIMIT 1")
		if err != nil {
			// maybe this completes the todo -- I need to do more research to figure it out
			log.Fatalln(err)
		}
		if res.Next() {
			var result int
			res.Scan(&result)
			log.Println("result:", result)
			latestSongPosChan <- result
			close(latestSongPosChan)
			return
		}
		latestSongPosChan <- 0
		close(latestSongPosChan)
	}()
	return <-latestSongPosChan
}
