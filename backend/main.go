package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	//config.AllowAllOrigins = true
	router.Use(cors.New(config))
	router.GET("/youtube", youtubeMiddleware)
	router.Run("localhost:4040")
}

