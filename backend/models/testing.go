package models

type UnitTesting []struct {
	Description          string
	Path                 string
	Method               string
	ExpectedCodeResponse int
}
