package middleware

import (
	"backend/twitch-bot/models"
	"net/http"
	"os"
	"testing"
)

func TestServerRoutes(t *testing.T) {
	tests := models.UnitTesting{
		{
			Description:          "route used to enter song's into the song request queue",
			Path:                 "/song-request",
			Method:               "GET",
			ExpectedCodeResponse: 400,
		},
		{
			Description:          "non-existent route",
			Path:                 "/i-don't-exist",
			Method:               "GET",
			ExpectedCodeResponse: 404,
		},
		{
			Description:          "route used to delete song's from the song request queue",
			Path:                 "/song-request-delete",
			Method:               "GET",
			ExpectedCodeResponse: 400,
		},
		{
			Description:          "route used to fetch all the song's from the song request queue",
			Path:                 "/songs",
			Method:               "GET",
			ExpectedCodeResponse: 400,
		},
		{
			Description:          "route used to authenticated the user using twitch",
			Path:                 "/auth/twitch",
			Method:               "POST",
			ExpectedCodeResponse: 401,
		},
		{
			Description:          "route used to fetch the users twitch information",
			Path:                 "/twitch/user",
			Method:               "GET",
			ExpectedCodeResponse: 401,
		},
		{
			Description:          "route used to modify the users twitch broadcast information",
			Path:                 "/twitch/modify",
			Method:               "POST",
			ExpectedCodeResponse: 401,
		},
		{
			Description:          "route used to validate the users twitch access token",
			Path:                 "/auth/twitch/validate",
			Method:               "POST",
			ExpectedCodeResponse: 401,
		},
		{
			Description:          "route used to revoke the users current session twitch access token",
			Path:                 "/auth/twitch/revoke",
			Method:               "POST",
			ExpectedCodeResponse: 401,
		},
	}

	app := Server()

	for _, test := range tests {
		req, _ := http.NewRequest(test.Method, test.Path, nil)
		if test.Path == "/song-request" {
			q := req.URL.Query()
			q.Add("channel", "testchannel")
			q.Add("user", "testuser")
			q.Add("q", "test")
			req.URL.RawQuery = q.Encode()
		}

		if test.Path == "/song-request-delete" {
			q := req.URL.Query()
			q.Add("channel", "testchannel")
			q.Add("id", "1")
			req.URL.RawQuery = q.Encode()
		}

		if test.Path == "/songs" {
			q := req.URL.Query()
			q.Add("channel", "testchannel")
			req.URL.RawQuery = q.Encode()
		}

		if test.Path == "/auth/twitch" {
			q := req.URL.Query()
			q.Add("code", os.Getenv("UNIT_TESTING_AUTH_CODE"))
			req.URL.RawQuery = q.Encode()
		}

		if test.Path == "/twitch/modify" {
			q := req.URL.Query()
			q.Add("title", "unit testing")
			q.Add("game", "Software & Game Development")
			req.URL.RawQuery = q.Encode()
		}

		res, err := app.Test(req, -1)
		if err != nil {
			t.Fatal(err.Error())
		}
		if test.ExpectedCodeResponse != res.StatusCode {
			t.Fatalf("FAILED, the response code for path %s was not the same!", test.Path)
		}
		t.Log("PASSED. the response code was the expected code!")
	}
}
