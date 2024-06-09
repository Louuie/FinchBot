package handlers

import (
	"errors"

	"github.com/gofiber/fiber/v2/middleware/session"
)


func CatchSessionError(sess *session.Session, err error) error {
	if err != nil {
		return errors.New("not authenticated! (couldn't get session) err != nil")
	}
	if sess == nil {
		return errors.New("not authenticated! (couldn't get session) sess == nil")
	}
	if sess.Get("authenticated") == nil {
		return errors.New("not authenticated! (couldn't get session)")
	}
	return nil
}
