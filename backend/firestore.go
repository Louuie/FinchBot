package main

import (
	"context"
	"log"

	firebase "firebase.google.com/go"

	"google.golang.org/api/option"
)
  
func insertSong(songData Song) {
	go func() {
		opt := option.WithCredentialsFile("./da-community-bot-firebase-adminsdk-1lkpq-2f93bb5073.json")	
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err != nil {
			log.Fatalln(err)
		}
		client, err := app.Firestore(context.Background())
		if err != nil {
		  log.Fatalln(err)
		}
	
			
		ref := client.Collection("chenzo-song-request").NewDoc()
	
		result, err := ref.Set(context.Background(), songData)
		if(err != nil) {
			log.Fatalln(err)
		}
		log.Print(result)
	}()
}
  