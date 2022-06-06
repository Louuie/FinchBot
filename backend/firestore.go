package main

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"

	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

// TODO: add better documentation for file
func insertSong(songData ClientSong) {
	go func() {
		// grabs the service account from the admin sdk
		opt := option.WithCredentialsFile(os.Getenv("GOOGLE_SDK"))
		// creates a firebase app
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err != nil {
			log.Fatalln(err)
		}
		// creates a firestore client
		client, err := app.Firestore(context.Background())
		if err != nil {
			log.Fatalln(err)
		}
		// grabs the ref from the collection
		ref := client.Collection(songData.Channel + "-song-request")
		// gets the song position by passing the ref
		position := getSongPosition(ref)
		if position.IteratorDone {
			// if there is no location then create a new Song object with the position value of 1.
			song := Song{
				User:     songData.User,
				Title:    songData.Title,
				Artist:   songData.Artist,
				Duration: songData.Duration,
				VideoID:  songData.VideoID,
				Position: position.Location,
			}
			// inserts the new song object into the database
			result, err := ref.NewDoc().Set(context.Background(), song)
			if err != nil {
				log.Fatalln(err)
			}
			log.Println(result)
			return
		}
		// if there is a location then create a new Song object by incrementing the position value by 1.

		song := Song{
			User:     songData.User,
			Title:    songData.Title,
			Artist:   songData.Artist,
			Duration: songData.Duration,
			VideoID:  songData.VideoID,
			Position: position.Location,
		}
		// inserts the new song object into the database
		result, err := ref.NewDoc().Set(context.Background(), song)
		if err != nil {
			log.Fatalln(err)
		}
		log.Println(result)
	}()
}

func getSongPosition(ref *firestore.CollectionRef) SongPosition {
	songPositionChan := make(chan SongPosition)
	go func() {
		documents := ref.OrderBy("position", firestore.Desc).Limit(1).Snapshots(context.Background())
		snap, err := documents.Next()
		if err != nil {
			log.Fatalln(err)
		}

		if snap == nil {
			log.Println("The Position does not exist, meaning there are no songs in the queue!")
			return
		}
		doc, err := snap.Documents.Next()
		// if the current queue
		if err == iterator.Done {
			songPosition := SongPosition{
				Location:     1,
				IteratorDone: true,
			}
			songPositionChan <- songPosition
			close(songPositionChan)
			return
		}
		if err != nil {
			log.Fatalln(err)
		}
		sPosition := doc.Data()["position"].(float64)
		position := SongPosition{
			Location:     sPosition + 1,
			IteratorDone: false,
		}
		songPositionChan <- position
		close(songPositionChan)
	}()
	return <-songPositionChan
}
