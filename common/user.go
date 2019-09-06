package common

import "time"

type LoginUser struct {
	Id   int
	Name string
	Role int
}

type SingleUserTrainingHistory struct {
	Content    string
	Role       string
	Addition   []string
	UserAnswer string
	Answer     string
	Correct    bool
}

type UploadQuestionRecord struct {
	Content    string
	Addition   []string
	Answer     string
	Role       string
	CreateTime time.Time
	Review     string
	Reviewers  []string
}
